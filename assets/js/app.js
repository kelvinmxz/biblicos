/**
 * Motor Interativo - Evangelho de Mateus (CCB Jovens e Menores)
 * Controla navegação, troca dinâmica das 3 fotos da igreja, pontuações locais
 * e todas as dinâmicas bíblicas e de estudo.
 */
(function (global) {
  'use strict';

  const {
    CHURCH_BACKGROUNDS,
    QUIZ_QUESTIONS,
    CHARACTERS_GAME,
    WORD_CHALLENGES,
    TIMELINE_SETS,
    TRUE_FALSE_QUESTIONS,
    STUDY_DATA
  } = global.MateusData;

  const initialCache = global.ProgressCache.loadSync();

  const state = {
    view: 'home',
    score: initialCache.score,
    streak: 0,
    bestStreak: initialCache.bestStreak,
    readChapters: initialCache.readChapters.slice(),
    backupMsg: '',
    showRestoreBox: false,
    bgMode: 'auto', // 'auto' | 'sunset1' | 'sunset2' | 'night'
    activeBgLayer: 'a',
    currentBgId: null,
    activeTimer: null,

    // Estado por dinâmica
    quiz: { level: 'todos', list: [], idx: 0, correct: 0, answered: false, chosen: -1 },
    character: { list: [], idx: 0, clueIdx: 0, correct: 0, answered: false, chosen: '' },
    word: { list: [], idx: 0, guessed: new Set(), errors: 0, maxErrors: 5, timeLeft: 0, totalTime: 0, finished: false, won: false, correct: 0 },
    tf: { list: [], idx: 0, timeLeft: 12, totalTime: 12, answered: false, chosen: null, correct: 0 },
    timeline: { idx: 0, order: [], checked: false, scoreRound: 0 },
    studyTab: 'overview'
  };

  // ---------- Utilitários ----------
  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function normalizeChar(ch) {
    return ch
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function clearActiveTimer() {
    if (state.activeTimer) {
      clearInterval(state.activeTimer);
      state.activeTimer = null;
    }
  }

  function persistProgress() {
    global.ProgressCache.save({
      score: state.score,
      bestStreak: state.bestStreak,
      readChapters: state.readChapters,
      sound: global.SoundFX.isEnabled()
    });
  }

  function addPoints(pts) {
    state.score += pts;
    state.streak += 1;
    if (state.streak > state.bestStreak) {
      state.bestStreak = state.streak;
    }
    persistProgress();
    updateHUD();
  }

  function resetStreak() {
    state.streak = 0;
    updateHUD();
  }

  function updateHUD() {
    const scoreEl = document.getElementById('hud-score');
    const streakEl = document.getElementById('hud-streak');
    if (scoreEl) scoreEl.textContent = String(state.score);
    if (streakEl) streakEl.textContent = String(state.streak);
  }

  // ---------- Controle Dinâmico das 3 Fotos da Igreja ----------
  function getTargetBgForView(view) {
    if (state.bgMode !== 'auto') {
      return state.bgMode;
    }
    if (view === 'word' || view === 'tf') {
      return 'night';
    }
    if (view === 'quiz' || view === 'character' || view === 'timeline') {
      return 'sunset2';
    }
    return 'sunset1';
  }

  function applyBackground(view) {
    const bgId = getTargetBgForView(view);
    const bg = CHURCH_BACKGROUNDS[bgId] || CHURCH_BACKGROUNDS.sunset1;

    document.body.classList.toggle('theme-night', bg.theme === 'night');
    document.body.classList.toggle('theme-dusk', bg.theme !== 'night');

    const cycleIcon = document.getElementById('bg-cycle-icon');
    const cycleLabel = document.getElementById('bg-cycle-label');
    if (cycleIcon && cycleLabel) {
      const modeNames = {
        auto: 'Fundo: Auto',
        sunset1: 'Fundo: Entardecer 1',
        sunset2: 'Fundo: Entardecer 2',
        night: 'Fundo: Noite'
      };
      cycleLabel.textContent = modeNames[state.bgMode];
      cycleIcon.innerHTML = global.Icons.get(bg.theme === 'night' ? 'moon' : 'sun', 'icon-sm');
    }

    if (state.currentBgId === bgId) return;
    state.currentBgId = bgId;

    const layerA = document.getElementById('bg-layer-a');
    const layerB = document.getElementById('bg-layer-b');
    if (!layerA || !layerB) return;

    const incoming = state.activeBgLayer === 'a' ? layerB : layerA;
    const outgoing = state.activeBgLayer === 'a' ? layerA : layerB;

    incoming.style.backgroundImage = `url('${bg.src}')`;
    incoming.classList.add('is-visible');
    outgoing.classList.remove('is-visible');
    state.activeBgLayer = state.activeBgLayer === 'a' ? 'b' : 'a';
  }

  function cycleBgMode() {
    const order = ['auto', 'sunset1', 'sunset2', 'night'];
    const nextIdx = (order.indexOf(state.bgMode) + 1) % order.length;
    state.bgMode = order[nextIdx];
    global.SoundFX.click();
    applyBackground(state.view);
  }

  // ---------- Navegação ----------
  function setView(view) {
    clearActiveTimer();
    state.view = view;
    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.view === view);
    });
    applyBackground(view);

    if (view === 'quiz' && state.quiz.list.length === 0) startQuiz(state.quiz.level);
    else if (view === 'character' && state.character.list.length === 0) startCharacterGame();
    else if (view === 'word' && state.word.list.length === 0) startWordGame();
    else if (view === 'tf' && state.tf.list.length === 0) startTFGame();
    else if (view === 'timeline' && state.timeline.order.length === 0) loadTimelineRound(state.timeline.idx);
    else {
      render();
      if (view === 'word' && !state.word.finished) resumeWordTimer();
      if (view === 'tf' && !state.tf.answered && state.tf.idx < state.tf.list.length) resumeTFTimer();
    }
  }

  function render() {
    const stage = document.getElementById('app-stage');
    if (!stage) return;

    switch (state.view) {
      case 'home':
        stage.innerHTML = renderHome();
        bindHomeEvents();
        break;
      case 'quiz':
        stage.innerHTML = renderQuiz();
        bindQuizEvents();
        break;
      case 'character':
        stage.innerHTML = renderCharacterGame();
        bindCharacterEvents();
        break;
      case 'word':
        stage.innerHTML = renderWordGame();
        bindWordEvents();
        break;
      case 'tf':
        stage.innerHTML = renderTFGame();
        bindTFEvents();
        break;
      case 'timeline':
        stage.innerHTML = renderTimelineGame();
        bindTimelineEvents();
        break;
      case 'study':
        stage.innerHTML = renderStudyView();
        bindStudyEvents();
        break;
    }

    global.Icons.hydrate(stage);
  }

  // =====================================================================
  // VIEW 1: INÍCIO
  // =====================================================================
  function renderHome() {
    const readCount = state.readChapters.length;
    const pct = Math.round((readCount / 28) * 100);

    return `
      <section class="hero-panel">
        <div class="glass-card">
          <div class="hero-eyebrow">
            <span data-icon="book" data-icon-class="icon-xs"></span>
            <span>ESTUDO E DINÂMICAS BÍBLICAS &bull; MATEUS 1 AO 28</span>
          </div>
          <h2 class="hero-title">Descubra o Evangelho de Mateus jogando e lendo a Palavra</h2>
          <p class="hero-desc">
            Portal preparado especialmente para os jovens e menores da Congregação Cristã no Brasil.
            Teste sua leitura com desafios de perguntas, personagens, palavras cronometradas, linha do tempo
            e curiosidades baseadas nas Escrituras e nos guias de estudo da nossa comum.
          </p>
          <div class="hero-actions">
            <button type="button" class="btn btn-primary" data-goto="quiz">
              <span data-icon="play" data-icon-class="icon-sm"></span>
              <span>Começar Quiz da Palavra</span>
            </button>
            <button type="button" class="btn btn-secondary" data-goto="study">
              <span data-icon="book-open" data-icon-class="icon-sm"></span>
              <span>Explorar Estudo e 28 Capítulos</span>
            </button>
          </div>
        </div>

        <div class="glass-card reading-summary-card">
          <div>
            <div class="progress-header">
              <h3 class="progress-title">
                <span data-icon="list-checks" data-icon-class="icon-md"></span>
                <span>Minha Leitura de Mateus</span>
              </h3>
              <span class="tag-chip">${readCount} / 28 capítulos (${pct}%)</span>
            </div>
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width: ${pct}%"></div>
            </div>
            <p style="margin:0; font-size:0.84rem; color:var(--text-muted);">
              Marque cada capítulo que você já leu na Bíblia e acompanhe sua jornada!
            </p>
          </div>

          <div class="verse-spotlight">
            <blockquote>&ldquo;Ela dará à luz um filho e lhe porás o nome de Jesus, porque ele salvará o seu povo dos pecados deles.&rdquo;</blockquote>
            <cite>Mateus 1:21 &bull; Emanuel, Deus conosco</cite>
          </div>

          <button type="button" class="btn btn-accent-blue btn-sm" data-goto="study" data-study-target="chapters">
            <span data-icon="check-circle" data-icon-class="icon-sm"></span>
            <span>Marcar Capítulos Lidos</span>
          </button>
        </div>
      </section>

      <div class="section-heading">
        <h2>
          <span data-icon="compass" data-icon-class="icon-md"></span>
          <span>Escolha uma Dinâmica</span>
        </h2>
        <span style="font-size:0.84rem; color:var(--text-muted);">O fundo da Comum muda automaticamente conforme o desafio</span>
      </div>

      <section class="modes-grid">
        <button type="button" class="mode-card" data-goto="quiz">
          <div class="mode-card-top">
            <div class="mode-icon"><span data-icon="help-circle" data-icon-class="icon-md"></span></div>
            <span class="mode-badge">Fácil, Jovens &amp; PDFs</span>
          </div>
          <div>
            <h3>Quiz da Palavra</h3>
            <p>Perguntas de múltipla escolha de Mateus 1 a 28, incluindo genealogia, milagres, parábolas e curiosidades dos estudos.</p>
          </div>
          <div class="mode-card-foot">
            <span>${QUIZ_QUESTIONS.length} questões em 3 níveis</span>
            <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
          </div>
        </button>

        <button type="button" class="mode-card" data-goto="character">
          <div class="mode-card-top">
            <div class="mode-icon"><span data-icon="user" data-icon-class="icon-md"></span></div>
            <span class="mode-badge">Pistas Progressivas</span>
          </div>
          <div>
            <h3>Quem Sou Eu?</h3>
            <p>Descubra o personagem do livro de Mateus! Quanto menos pistas você precisar revelar, mais pontos conquista.</p>
          </div>
          <div class="mode-card-foot">
            <span>${CHARACTERS_GAME.length} personagens bíblicos</span>
            <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
          </div>
        </button>

        <button type="button" class="mode-card is-night-mode" data-goto="word">
          <div class="mode-card-top">
            <div class="mode-icon"><span data-icon="timer" data-icon-class="icon-md"></span></div>
            <span class="mode-badge">Fundo Noturno &bull; Tempo</span>
          </div>
          <div>
            <h3>Acerte a Palavra no Tempo</h3>
            <p>Ativa o clima noturno de vigília na Comum! Complete a palavra-chave de Mateus antes que o cronômetro chegue a zero.</p>
          </div>
          <div class="mode-card-foot">
            <span>${WORD_CHALLENGES.length} desafios cronometrados</span>
            <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
          </div>
        </button>

        <button type="button" class="mode-card is-night-mode" data-goto="tf">
          <div class="mode-card-top">
            <div class="mode-icon"><span data-icon="zap" data-icon-class="icon-md"></span></div>
            <span class="mode-badge">Fundo Noturno &bull; 12s</span>
          </div>
          <div>
            <h3>Verdadeiro ou Falso Relâmpago</h3>
            <p>Responda em poucos segundos se a afirmação está na Bíblia ou é mito. Excelente para testar atenção aos detalhes!</p>
          </div>
          <div class="mode-card-foot">
            <span>${TRUE_FALSE_QUESTIONS.length} afirmações rápidas</span>
            <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
          </div>
        </button>

        <button type="button" class="mode-card" data-goto="timeline">
          <div class="mode-card-top">
            <div class="mode-icon"><span data-icon="map" data-icon-class="icon-md"></span></div>
            <span class="mode-badge">Ordem &amp; Geografia</span>
          </div>
          <div>
            <h3>Linha do Tempo da Jornada</h3>
            <p>Organize os acontecimentos, os 5 Grandes Discursos, a genealogia e o roteiro geográfico de Jesus na ordem correta.</p>
          </div>
          <div class="mode-card-foot">
            <span>${TIMELINE_SETS.length} jornadas temáticas</span>
            <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
          </div>
        </button>

        <button type="button" class="mode-card" data-goto="study">
          <div class="mode-card-top">
            <div class="mode-icon"><span data-icon="scroll" data-icon-class="icon-md"></span></div>
            <span class="mode-badge">Guia Completo + Fotos</span>
          </div>
          <div>
            <h3>Estudo, Curiosidades e Comum</h3>
            <p>Resumo dos 3 blocos da genealogia, 5 mulheres, 5 discursos, mapa da jornada, curiosidades e as 3 fotos da nossa Comum.</p>
          </div>
          <div class="mode-card-foot">
            <span>Material completo dos guias</span>
            <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
          </div>
        </button>
      </section>
    `;
  }

  function bindHomeEvents() {
    document.querySelectorAll('[data-goto]').forEach((el) => {
      el.addEventListener('click', () => {
        global.SoundFX.click();
        const target = el.dataset.goto;
        const studyTarget = el.dataset.studyTarget;
        if (studyTarget) state.studyTab = studyTarget;
        setView(target);
      });
    });
  }

  // =====================================================================
  // VIEW 2: QUIZ DA PALAVRA
  // =====================================================================
  function startQuiz(level) {
    const lvl = level || 'todos';
    const pool = lvl === 'todos'
      ? QUIZ_QUESTIONS
      : QUIZ_QUESTIONS.filter((q) => q.level === lvl);

    state.quiz = {
      level: lvl,
      list: shuffle(pool).slice(0, 10),
      idx: 0,
      correct: 0,
      answered: false,
      chosen: -1
    };
    render();
  }

  function renderQuiz() {
    const qz = state.quiz;
    const levels = [
      { id: 'todos', label: 'Todos' },
      { id: 'facil', label: 'Iniciante (Crianças)' },
      { id: 'medio', label: 'Jovens (Médio)' },
      { id: 'avancado', label: 'Estudo PDFs (Avançado)' }
    ];

    const headerBar = `
      <div class="game-topbar">
        <div class="game-title-group">
          <span data-icon="help-circle" data-icon-class="icon-md"></span>
          <h2>Quiz da Palavra</h2>
        </div>
        <div class="filter-pills">
          ${levels.map((l) => `
            <button type="button" class="filter-pill ${qz.level === l.id ? 'is-active' : ''}" data-quiz-level="${l.id}">
              ${l.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;

    if (qz.idx >= qz.list.length) {
      return `
        <div class="glass-card game-shell">
          ${headerBar}
          <div class="summary-box">
            <div class="summary-trophy"><span data-icon="trophy" data-icon-class="icon-xl"></span></div>
            <h3>Rodada Concluída!</h3>
            <div class="summary-score">${qz.correct} / ${qz.list.length} acertos</div>
            <p style="color:var(--text-muted); max-width:480px; margin:0 auto 1.25rem;">
              Continue lendo o Evangelho de Mateus todos os dias para fortalecer seu conhecimento da Palavra!
            </p>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
              <button type="button" class="btn btn-primary" id="btn-quiz-restart">
                <span data-icon="refresh" data-icon-class="icon-sm"></span>
                <span>Nova Rodada</span>
              </button>
              <button type="button" class="btn btn-secondary" data-back-home>
                <span data-icon="home" data-icon-class="icon-sm"></span>
                <span>Voltar ao Início</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const q = qz.list[qz.idx];
    const letters = ['A', 'B', 'C', 'D'];
    const levelLabel = { facil: 'Iniciante', medio: 'Jovens', avancado: 'Avançado' }[q.level];

    return `
      <div class="glass-card game-shell">
        ${headerBar}
        <div class="question-meta">
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap; align-items:center;">
            <span class="tag-chip">${escapeHtml(q.topic)}</span>
            <span class="tag-chip">${levelLabel}</span>
            <span class="tag-chip">${escapeHtml(q.ref)}</span>
          </div>
          <span>Pergunta <strong>${qz.idx + 1}</strong> de ${qz.list.length}</span>
        </div>

        <h3 class="question-prompt">${escapeHtml(q.question)}</h3>

        <div class="options-list">
          ${q.options.map((opt, i) => {
            let cls = 'option-btn';
            if (qz.answered) {
              if (i === q.answer) cls += ' is-correct';
              else if (i === qz.chosen) cls += ' is-wrong';
            }
            return `
              <button type="button" class="${cls}" data-quiz-opt="${i}" ${qz.answered ? 'disabled' : ''}>
                <span class="option-letter">${letters[i]}</span>
                <span>${escapeHtml(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${qz.answered ? `
          <div class="feedback-box ${qz.chosen === q.answer ? 'is-correct' : 'is-wrong'}">
            <div class="feedback-head">
              <span data-icon="${qz.chosen === q.answer ? 'check-circle' : 'x-circle'}" data-icon-class="icon-sm"></span>
              <span>${qz.chosen === q.answer ? 'Resposta Correta! (+15 pontos)' : 'Não foi desta vez — veja a explicação:'}</span>
            </div>
            <p class="feedback-body">${escapeHtml(q.explanation)}</p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-quiz-next">
              <span>${qz.idx + 1 < qz.list.length ? 'Próxima Pergunta' : 'Ver Resultado Final'}</span>
              <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function bindQuizEvents() {
    document.querySelectorAll('[data-quiz-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        global.SoundFX.click();
        startQuiz(btn.dataset.quizLevel);
      });
    });

    document.querySelectorAll('[data-quiz-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.quiz.answered) return;
        const idx = Number(btn.dataset.quizOpt);
        const q = state.quiz.list[state.quiz.idx];
        state.quiz.answered = true;
        state.quiz.chosen = idx;
        if (idx === q.answer) {
          state.quiz.correct += 1;
          addPoints(15);
          global.SoundFX.correct();
        } else {
          resetStreak();
          global.SoundFX.wrong();
        }
        render();
      });
    });

    const nextBtn = document.getElementById('btn-quiz-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        global.SoundFX.click();
        state.quiz.idx += 1;
        state.quiz.answered = false;
        state.quiz.chosen = -1;
        if (state.quiz.idx >= state.quiz.list.length) global.SoundFX.victory();
        render();
      });
    }

    const restartBtn = document.getElementById('btn-quiz-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        global.SoundFX.click();
        startQuiz(state.quiz.level);
      });
    }

    const backBtn = document.querySelector('[data-back-home]');
    if (backBtn) backBtn.addEventListener('click', () => setView('home'));
  }

  // =====================================================================
  // VIEW 3: QUEM SOU EU? (Personagens de Mateus)
  // =====================================================================
  function startCharacterGame() {
    const list = shuffle(CHARACTERS_GAME).slice(0, 8).map((c) => ({
      ...c,
      shuffledOptions: shuffle(c.options)
    }));
    state.character = { list, idx: 0, clueIdx: 0, correct: 0, answered: false, chosen: '' };
    render();
  }

  function renderCharacterGame() {
    const ch = state.character;
    const top = `
      <div class="game-topbar">
        <div class="game-title-group">
          <span data-icon="user" data-icon-class="icon-md"></span>
          <h2>Quem Sou Eu? &mdash; Personagens de Mateus</h2>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-char-restart">
          <span data-icon="refresh" data-icon-class="icon-sm"></span>
          <span>Reiniciar</span>
        </button>
      </div>
    `;

    if (ch.idx >= ch.list.length) {
      return `
        <div class="glass-card game-shell">
          ${top}
          <div class="summary-box">
            <div class="summary-trophy"><span data-icon="award" data-icon-class="icon-xl"></span></div>
            <h3>Desafio de Personagens Concluído!</h3>
            <div class="summary-score">${ch.correct} / ${ch.list.length} personagens descobertos</div>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; margin-top:1rem;">
              <button type="button" class="btn btn-primary" id="btn-char-play-again">
                <span data-icon="refresh" data-icon-class="icon-sm"></span>
                <span>Jogar Novamente</span>
              </button>
              <button type="button" class="btn btn-secondary" data-back-home>
                <span data-icon="home" data-icon-class="icon-sm"></span>
                <span>Início</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const item = ch.list[ch.idx];
    const ptsForCurrentClue = [30, 20, 10][ch.clueIdx] || 10;

    return `
      <div class="glass-card game-shell">
        ${top}
        <div class="question-meta">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span class="tag-chip">Valendo ${ptsForCurrentClue} pontos</span>
            <span class="tag-chip">${escapeHtml(item.ref)}</span>
          </div>
          <span>Personagem <strong>${ch.idx + 1}</strong> de ${ch.list.length}</span>
        </div>

        <div class="clues-stack">
          ${item.clues.map((clueText, i) => {
            const unlocked = i <= ch.clueIdx || ch.answered;
            return `
              <div class="clue-item ${unlocked ? '' : 'is-locked'}">
                <span class="clue-num">Pista ${i + 1}</span>
                <span>${unlocked ? escapeHtml(clueText) : 'Pista oculta &mdash; clique em "Revelar próxima pista" se precisar de ajuda.'}</span>
              </div>
            `;
          }).join('')}
        </div>

        ${!ch.answered && ch.clueIdx < 2 ? `
          <div style="margin-bottom:1.1rem;">
            <button type="button" class="btn btn-accent-blue btn-sm" id="btn-reveal-clue">
              <span data-icon="lightbulb" data-icon-class="icon-sm"></span>
              <span>Revelar Pista ${ch.clueIdx + 2}</span>
            </button>
          </div>
        ` : ''}

        <div class="options-list">
          ${item.shuffledOptions.map((opt) => {
            let cls = 'option-btn';
            if (ch.answered) {
              if (opt === item.name) cls += ' is-correct';
              else if (opt === ch.chosen) cls += ' is-wrong';
            }
            return `
              <button type="button" class="${cls}" data-char-opt="${escapeHtml(opt)}" ${ch.answered ? 'disabled' : ''}>
                <span class="option-letter"><span data-icon="user" data-icon-class="icon-xs"></span></span>
                <span>${escapeHtml(opt)}</span>
              </button>
            `;
          }).join('')}
        </div>

        ${ch.answered ? `
          <div class="feedback-box ${ch.chosen === item.name ? 'is-correct' : 'is-wrong'}">
            <div class="feedback-head">
              <span data-icon="${ch.chosen === item.name ? 'check-circle' : 'x-circle'}" data-icon-class="icon-sm"></span>
              <span>${ch.chosen === item.name ? `Acertou! Era ${escapeHtml(item.name)} (+${ptsForCurrentClue} pts)` : `A resposta correta era ${escapeHtml(item.name)}`}</span>
            </div>
            <p class="feedback-body"><strong>${escapeHtml(item.role)}:</strong> ${escapeHtml(item.summary)}</p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-char-next">
              <span>${ch.idx + 1 < ch.list.length ? 'Próximo Personagem' : 'Ver Resultado'}</span>
              <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function bindCharacterEvents() {
    const revealBtn = document.getElementById('btn-reveal-clue');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => {
        global.SoundFX.click();
        if (state.character.clueIdx < 2) {
          state.character.clueIdx += 1;
          render();
        }
      });
    }

    document.querySelectorAll('[data-char-opt]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.character.answered) return;
        const chosen = btn.dataset.charOpt;
        const item = state.character.list[state.character.idx];
        const pts = [30, 20, 10][state.character.clueIdx] || 10;
        state.character.answered = true;
        state.character.chosen = chosen;
        if (chosen === item.name) {
          state.character.correct += 1;
          addPoints(pts);
          global.SoundFX.correct();
        } else {
          resetStreak();
          global.SoundFX.wrong();
        }
        render();
      });
    });

    const nextBtn = document.getElementById('btn-char-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        global.SoundFX.click();
        state.character.idx += 1;
        state.character.clueIdx = 0;
        state.character.answered = false;
        state.character.chosen = '';
        if (state.character.idx >= state.character.list.length) global.SoundFX.victory();
        render();
      });
    }

    const r1 = document.getElementById('btn-char-restart');
    const r2 = document.getElementById('btn-char-play-again');
    if (r1) r1.addEventListener('click', () => { global.SoundFX.click(); startCharacterGame(); });
    if (r2) r2.addEventListener('click', () => { global.SoundFX.click(); startCharacterGame(); });
    const backBtn = document.querySelector('[data-back-home]');
    if (backBtn) backBtn.addEventListener('click', () => setView('home'));
  }

  // =====================================================================
  // VIEW 4: ACERTE A PALAVRA NO TEMPO (Fundo Noturno + Cronômetro)
  // =====================================================================
  function startWordGame() {
    clearActiveTimer();
    const list = shuffle(WORD_CHALLENGES).slice(0, 8);
    state.word = {
      list,
      idx: 0,
      guessed: new Set(),
      errors: 0,
      maxErrors: 5,
      timeLeft: list[0].seconds,
      totalTime: list[0].seconds,
      finished: false,
      won: false,
      correct: 0
    };
    render();
    resumeWordTimer();
  }

  function setupWordRound(idx) {
    clearActiveTimer();
    const w = state.word;
    w.idx = idx;
    if (w.idx >= w.list.length) {
      w.finished = true;
      global.SoundFX.victory();
      render();
      return;
    }
    const item = w.list[idx];
    w.guessed = new Set();
    w.errors = 0;
    w.timeLeft = item.seconds;
    w.totalTime = item.seconds;
    w.finished = false;
    w.won = false;
    render();
    resumeWordTimer();
  }

  function resumeWordTimer() {
    clearActiveTimer();
    state.activeTimer = setInterval(() => {
      if (state.view !== 'word' || state.word.finished) {
        clearActiveTimer();
        return;
      }
      state.word.timeLeft -= 1;
      if (state.word.timeLeft <= 5 && state.word.timeLeft > 0) {
        global.SoundFX.tick();
      }
      if (state.word.timeLeft <= 0) {
        state.word.timeLeft = 0;
        state.word.finished = true;
        state.word.won = false;
        clearActiveTimer();
        resetStreak();
        global.SoundFX.wrong();
        render();
        return;
      }
      const timerText = document.getElementById('word-timer-text');
      const timerFill = document.getElementById('word-timer-fill');
      if (timerText) {
        timerText.textContent = `${state.word.timeLeft}s`;
        timerText.classList.toggle('is-urgent', state.word.timeLeft <= 5);
      }
      if (timerFill) {
        const pct = Math.max(0, (state.word.timeLeft / state.word.totalTime) * 100);
        timerFill.style.width = `${pct}%`;
        timerFill.classList.toggle('is-urgent', state.word.timeLeft <= 5);
      }
    }, 1000);
  }

  function guessWordLetter(rawLetter) {
    const w = state.word;
    if (w.finished || w.idx >= w.list.length) return;
    const letter = normalizeChar(rawLetter);
    if (!/^[A-Z]$/.test(letter) || w.guessed.has(letter)) return;

    w.guessed.add(letter);
    const targetWord = w.list[w.idx].word;
    const normalizedChars = Array.from(targetWord).map(normalizeChar);

    if (normalizedChars.includes(letter)) {
      global.SoundFX.click();
      const allFound = normalizedChars.every((ch) => w.guessed.has(ch));
      if (allFound) {
        w.finished = true;
        w.won = true;
        w.correct += 1;
        clearActiveTimer();
        const bonus = 15 + Math.max(0, w.timeLeft);
        addPoints(bonus);
        global.SoundFX.correct();
      }
    } else {
      w.errors += 1;
      global.SoundFX.wrong();
      if (w.errors >= w.maxErrors) {
        w.finished = true;
        w.won = false;
        clearActiveTimer();
        resetStreak();
      }
    }
    render();
  }

  function renderWordGame() {
    const w = state.word;
    const top = `
      <div class="game-topbar">
        <div class="game-title-group">
          <span data-icon="timer" data-icon-class="icon-md"></span>
          <h2>Acerte a Palavra no Tempo</h2>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-word-restart">
          <span data-icon="refresh" data-icon-class="icon-sm"></span>
          <span>Nova Rodada</span>
        </button>
      </div>
    `;

    if (w.idx >= w.list.length) {
      return `
        <div class="glass-card game-shell">
          ${top}
          <div class="summary-box">
            <div class="summary-trophy"><span data-icon="trophy" data-icon-class="icon-xl"></span></div>
            <h3>Vigília das Palavras Concluída!</h3>
            <div class="summary-score">${w.correct} / ${w.list.length} palavras acertadas</div>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; margin-top:1rem;">
              <button type="button" class="btn btn-primary" id="btn-word-play-again">
                <span data-icon="refresh" data-icon-class="icon-sm"></span>
                <span>Jogar Novamente</span>
              </button>
              <button type="button" class="btn btn-secondary" data-back-home>
                <span data-icon="home" data-icon-class="icon-sm"></span>
                <span>Início</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const item = w.list[w.idx];
    const chars = Array.from(item.word);
    const pct = Math.max(0, (w.timeLeft / w.totalTime) * 100);
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    return `
      <div class="glass-card game-shell">
        ${top}
        <div class="question-meta">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <span class="tag-chip">${escapeHtml(item.ref)}</span>
            <span class="tag-chip">Erros: ${w.errors} / ${w.maxErrors}</span>
          </div>
          <span>Palavra <strong>${w.idx + 1}</strong> de ${w.list.length}</span>
        </div>

        <div class="timer-bar-wrap">
          <div class="timer-label-row">
            <span>Tempo Restante</span>
            <span id="word-timer-text" class="timer-value ${w.timeLeft <= 5 ? 'is-urgent' : ''}">${w.timeLeft}s</span>
          </div>
          <div class="timer-track">
            <div id="word-timer-fill" class="timer-fill ${w.timeLeft <= 5 ? 'is-urgent' : ''}" style="width: ${pct}%"></div>
          </div>
        </div>

        <p class="question-prompt" style="text-align:center;">${escapeHtml(item.clue)}</p>

        <div class="word-slots">
          ${chars.map((ch) => {
            const norm = normalizeChar(ch);
            const revealed = w.guessed.has(norm);
            const showMissed = w.finished && !revealed;
            return `
              <div class="word-slot ${revealed ? 'is-filled' : ''} ${showMissed ? 'is-missed' : ''}">
                ${revealed || showMissed ? escapeHtml(ch) : ''}
              </div>
            `;
          }).join('')}
        </div>

        ${!w.finished ? `
          <div class="keyboard-grid">
            ${alphabet.map((l) => {
              let cls = 'key-btn';
              const used = w.guessed.has(l);
              if (used) {
                const hit = chars.some((ch) => normalizeChar(ch) === l);
                cls += hit ? ' is-hit' : ' is-miss';
              }
              return `<button type="button" class="${cls}" data-key-letter="${l}" ${used ? 'disabled' : ''}>${l}</button>`;
            }).join('')}
          </div>
          <p style="text-align:center; font-size:0.78rem; color:var(--text-dim); margin:0.85rem 0 0;">
            Dica: você também pode digitar diretamente no teclado do computador.
          </p>
        ` : `
          <div class="feedback-box ${w.won ? 'is-correct' : 'is-wrong'}">
            <div class="feedback-head">
              <span data-icon="${w.won ? 'check-circle' : 'x-circle'}" data-icon-class="icon-sm"></span>
              <span>${w.won ? `Palavra descoberta: ${escapeHtml(item.word)} (+${15 + w.timeLeft} pts)` : `Tempo ou tentativas esgotadas! A palavra era ${escapeHtml(item.word)}.`}</span>
            </div>
            <p class="feedback-body">Referência bíblica: <strong>${escapeHtml(item.ref)}</strong> &mdash; ${escapeHtml(item.clue)}</p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-word-next">
              <span>${w.idx + 1 < w.list.length ? 'Próxima Palavra' : 'Ver Resultado'}</span>
              <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
            </button>
          </div>
        `}
      </div>
    `;
  }

  function bindWordEvents() {
    document.querySelectorAll('[data-key-letter]').forEach((btn) => {
      btn.addEventListener('click', () => guessWordLetter(btn.dataset.keyLetter));
    });

    const nextBtn = document.getElementById('btn-word-next');
    if (nextBtn) nextBtn.addEventListener('click', () => { global.SoundFX.click(); setupWordRound(state.word.idx + 1); });

    const r1 = document.getElementById('btn-word-restart');
    const r2 = document.getElementById('btn-word-play-again');
    if (r1) r1.addEventListener('click', () => { global.SoundFX.click(); startWordGame(); });
    if (r2) r2.addEventListener('click', () => { global.SoundFX.click(); startWordGame(); });
    const backBtn = document.querySelector('[data-back-home]');
    if (backBtn) backBtn.addEventListener('click', () => setView('home'));
  }

  // =====================================================================
  // VIEW 5: VERDADEIRO OU FALSO RELÂMPAGO (Fundo Noturno + 12s)
  // =====================================================================
  function startTFGame() {
    clearActiveTimer();
    state.tf = {
      list: shuffle(TRUE_FALSE_QUESTIONS).slice(0, 10),
      idx: 0,
      timeLeft: 12,
      totalTime: 12,
      answered: false,
      chosen: null,
      correct: 0
    };
    render();
    resumeTFTimer();
  }

  function resumeTFTimer() {
    clearActiveTimer();
    state.activeTimer = setInterval(() => {
      if (state.view !== 'tf' || state.tf.answered || state.tf.idx >= state.tf.list.length) {
        clearActiveTimer();
        return;
      }
      state.tf.timeLeft -= 1;
      if (state.tf.timeLeft <= 4 && state.tf.timeLeft > 0) global.SoundFX.tick();
      if (state.tf.timeLeft <= 0) {
        state.tf.timeLeft = 0;
        state.tf.answered = true;
        state.tf.chosen = 'timeout';
        clearActiveTimer();
        resetStreak();
        global.SoundFX.wrong();
        render();
        return;
      }
      const txt = document.getElementById('tf-timer-text');
      const fill = document.getElementById('tf-timer-fill');
      if (txt) {
        txt.textContent = `${state.tf.timeLeft}s`;
        txt.classList.toggle('is-urgent', state.tf.timeLeft <= 4);
      }
      if (fill) {
        fill.style.width = `${(state.tf.timeLeft / state.tf.totalTime) * 100}%`;
        fill.classList.toggle('is-urgent', state.tf.timeLeft <= 4);
      }
    }, 1000);
  }

  function renderTFGame() {
    const tf = state.tf;
    const top = `
      <div class="game-topbar">
        <div class="game-title-group">
          <span data-icon="zap" data-icon-class="icon-md"></span>
          <h2>Verdadeiro ou Falso Relâmpago</h2>
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-tf-restart">
          <span data-icon="refresh" data-icon-class="icon-sm"></span>
          <span>Nova Rodada</span>
        </button>
      </div>
    `;

    if (tf.idx >= tf.list.length) {
      return `
        <div class="glass-card game-shell">
          ${top}
          <div class="summary-box">
            <div class="summary-trophy"><span data-icon="zap" data-icon-class="icon-xl"></span></div>
            <h3>Desafio Relâmpago Concluído!</h3>
            <div class="summary-score">${tf.correct} / ${tf.list.length} acertos</div>
            <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap; margin-top:1rem;">
              <button type="button" class="btn btn-primary" id="btn-tf-play-again">
                <span data-icon="refresh" data-icon-class="icon-sm"></span>
                <span>Jogar Novamente</span>
              </button>
              <button type="button" class="btn btn-secondary" data-back-home>
                <span data-icon="home" data-icon-class="icon-sm"></span>
                <span>Início</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    const item = tf.list[tf.idx];
    const pct = (tf.timeLeft / tf.totalTime) * 100;
    const isHit = tf.answered && tf.chosen === item.isTrue;

    return `
      <div class="glass-card game-shell">
        ${top}
        <div class="question-meta">
          <span class="tag-chip">${escapeHtml(item.ref)}</span>
          <span>Afirmação <strong>${tf.idx + 1}</strong> de ${tf.list.length}</span>
        </div>

        <div class="timer-bar-wrap">
          <div class="timer-label-row">
            <span>Responda rápido</span>
            <span id="tf-timer-text" class="timer-value ${tf.timeLeft <= 4 ? 'is-urgent' : ''}">${tf.timeLeft}s</span>
          </div>
          <div class="timer-track">
            <div id="tf-timer-fill" class="timer-fill ${tf.timeLeft <= 4 ? 'is-urgent' : ''}" style="width:${pct}%"></div>
          </div>
        </div>

        <h3 class="question-prompt">${escapeHtml(item.statement)}</h3>

        <div class="tf-buttons">
          <button type="button" class="tf-btn tf-btn-true" data-tf-ans="true" ${tf.answered ? 'disabled' : ''}>
            <span data-icon="check-circle" data-icon-class="icon-md"></span>
            <span>Verdadeiro</span>
          </button>
          <button type="button" class="tf-btn tf-btn-false" data-tf-ans="false" ${tf.answered ? 'disabled' : ''}>
            <span data-icon="x-circle" data-icon-class="icon-md"></span>
            <span>Falso</span>
          </button>
        </div>

        ${tf.answered ? `
          <div class="feedback-box ${isHit ? 'is-correct' : 'is-wrong'}">
            <div class="feedback-head">
              <span data-icon="${isHit ? 'check-circle' : 'x-circle'}" data-icon-class="icon-sm"></span>
              <span>${tf.chosen === 'timeout' ? 'Tempo esgotado!' : isHit ? 'Correto! (+12 pontos)' : 'Ops! Confira a verdade bíblica:'}</span>
            </div>
            <p class="feedback-body">${escapeHtml(item.explanation)}</p>
            <button type="button" class="btn btn-primary btn-sm" id="btn-tf-next">
              <span>${tf.idx + 1 < tf.list.length ? 'Próxima Afirmação' : 'Ver Resultado'}</span>
              <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }

  function bindTFEvents() {
    document.querySelectorAll('[data-tf-ans]').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (state.tf.answered) return;
        clearActiveTimer();
        const ans = btn.dataset.tfAns === 'true';
        const item = state.tf.list[state.tf.idx];
        state.tf.answered = true;
        state.tf.chosen = ans;
        if (ans === item.isTrue) {
          state.tf.correct += 1;
          addPoints(12);
          global.SoundFX.correct();
        } else {
          resetStreak();
          global.SoundFX.wrong();
        }
        render();
      });
    });

    const nextBtn = document.getElementById('btn-tf-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        global.SoundFX.click();
        state.tf.idx += 1;
        state.tf.timeLeft = 12;
        state.tf.answered = false;
        state.tf.chosen = null;
        if (state.tf.idx >= state.tf.list.length) {
          global.SoundFX.victory();
          render();
        } else {
          render();
          resumeTFTimer();
        }
      });
    }

    const r1 = document.getElementById('btn-tf-restart');
    const r2 = document.getElementById('btn-tf-play-again');
    if (r1) r1.addEventListener('click', () => { global.SoundFX.click(); startTFGame(); });
    if (r2) r2.addEventListener('click', () => { global.SoundFX.click(); startTFGame(); });
    const backBtn = document.querySelector('[data-back-home]');
    if (backBtn) backBtn.addEventListener('click', () => setView('home'));
  }

  // =====================================================================
  // VIEW 6: LINHA DO TEMPO (Ordenar Fatos e Geografia)
  // =====================================================================
  function loadTimelineRound(idx) {
    const safeIdx = idx % TIMELINE_SETS.length;
    const set = TIMELINE_SETS[safeIdx];
    let mixed = shuffle(set.items);
    // Garante que não comece já 100% ordenado
    if (mixed.every((item, i) => item.id === set.items[i].id)) {
      mixed = [mixed[1], mixed[0], mixed[3], mixed[2]];
    }
    state.timeline = { idx: safeIdx, order: mixed, checked: false, scoreRound: 0 };
    render();
  }

  function renderTimelineGame() {
    const tl = state.timeline;
    const set = TIMELINE_SETS[tl.idx];

    return `
      <div class="glass-card game-shell">
        <div class="game-topbar">
          <div class="game-title-group">
            <span data-icon="map" data-icon-class="icon-md"></span>
            <h2>Linha do Tempo da Jornada</h2>
          </div>
          <div class="filter-pills">
            ${TIMELINE_SETS.map((s, i) => `
              <button type="button" class="filter-pill ${tl.idx === i ? 'is-active' : ''}" data-tl-set="${i}">
                Jornada ${i + 1}
              </button>
            `).join('')}
          </div>
        </div>

        <div class="question-meta">
          <span class="tag-chip">${escapeHtml(set.ref)}</span>
          <span>Use as setas para colocar do <strong>1º ao 4º</strong> acontecimento</span>
        </div>

        <h3 class="question-prompt">${escapeHtml(set.title)}</h3>

        <div class="timeline-list">
          ${tl.order.map((item, i) => {
            let cls = 'timeline-row';
            if (tl.checked) {
              cls += item.id === set.items[i].id ? ' is-right' : ' is-wrong';
            }
            return `
              <div class="${cls}">
                <span class="timeline-pos">${i + 1}º</span>
                <div class="timeline-text">
                  <div>${escapeHtml(item.text)}</div>
                  ${tl.checked ? `<small style="color:var(--accent-text);">${escapeHtml(item.ref)}</small>` : ''}
                </div>
                <div class="timeline-controls">
                  <button type="button" class="icon-btn" data-tl-move="${i}" data-tl-dir="-1" ${i === 0 || tl.checked ? 'disabled' : ''} title="Subir">
                    <span data-icon="arrow-up" data-icon-class="icon-xs"></span>
                  </button>
                  <button type="button" class="icon-btn" data-tl-move="${i}" data-tl-dir="1" ${i === tl.order.length - 1 || tl.checked ? 'disabled' : ''} title="Descer">
                    <span data-icon="arrow-down" data-icon-class="icon-xs"></span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
          ${!tl.checked ? `
            <button type="button" class="btn btn-primary" id="btn-tl-check">
              <span data-icon="check-circle" data-icon-class="icon-sm"></span>
              <span>Verificar Ordem</span>
            </button>
          ` : `
            <button type="button" class="btn btn-primary" id="btn-tl-next">
              <span>Próxima Jornada</span>
              <span data-icon="arrow-right" data-icon-class="icon-sm"></span>
            </button>
          `}
          <button type="button" class="btn btn-secondary" id="btn-tl-reshuffle">
            <span data-icon="refresh" data-icon-class="icon-sm"></span>
            <span>Embaralhar</span>
          </button>
        </div>

        ${tl.checked ? `
          <div class="feedback-box ${tl.scoreRound === 4 ? 'is-correct' : 'is-wrong'}">
            <div class="feedback-head">
              <span data-icon="${tl.scoreRound === 4 ? 'check-circle' : 'info'}" data-icon-class="icon-sm"></span>
              <span>${tl.scoreRound === 4 ? 'Perfeito! Toda a sequência está correta! (+25 pts)' : `Você acertou ${tl.scoreRound} de 4 posições. Confira a ordem bíblica correta:`}</span>
            </div>
            ${tl.scoreRound < 4 ? `
              <p class="feedback-body">
                ${set.items.map((it, idx) => `<strong>${idx + 1}º:</strong> ${escapeHtml(it.text)} (${escapeHtml(it.ref)})`).join('<br>')}
              </p>
            ` : `<p class="feedback-body">Excelente leitura e memória geográfica do Evangelho de Mateus!</p>`}
          </div>
        ` : ''}
      </div>
    `;
  }

  function bindTimelineEvents() {
    document.querySelectorAll('[data-tl-set]').forEach((btn) => {
      btn.addEventListener('click', () => {
        global.SoundFX.click();
        loadTimelineRound(Number(btn.dataset.tlSet));
      });
    });

    document.querySelectorAll('[data-tl-move]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const i = Number(btn.dataset.tlMove);
        const dir = Number(btn.dataset.tlDir);
        const target = i + dir;
        const arr = state.timeline.order;
        if (target < 0 || target >= arr.length) return;
        [arr[i], arr[target]] = [arr[target], arr[i]];
        global.SoundFX.click();
        render();
      });
    });

    const checkBtn = document.getElementById('btn-tl-check');
    if (checkBtn) {
      checkBtn.addEventListener('click', () => {
        const set = TIMELINE_SETS[state.timeline.idx];
        let hits = 0;
        state.timeline.order.forEach((it, i) => {
          if (it.id === set.items[i].id) hits += 1;
        });
        state.timeline.checked = true;
        state.timeline.scoreRound = hits;
        if (hits === 4) {
          addPoints(25);
          global.SoundFX.correct();
        } else {
          resetStreak();
          global.SoundFX.wrong();
        }
        render();
      });
    }

    const nextBtn = document.getElementById('btn-tl-next');
    if (nextBtn) nextBtn.addEventListener('click', () => { global.SoundFX.click(); loadTimelineRound(state.timeline.idx + 1); });

    const reshuffleBtn = document.getElementById('btn-tl-reshuffle');
    if (reshuffleBtn) reshuffleBtn.addEventListener('click', () => { global.SoundFX.click(); loadTimelineRound(state.timeline.idx); });
  }

  // =====================================================================
  // VIEW 7: ESTUDO, CURIOSIDADES, COMUM E 28 CAPÍTULOS
  // =====================================================================
  function toggleChapterRead(ch) {
    const idx = state.readChapters.indexOf(ch);
    if (idx >= 0) {
      state.readChapters.splice(idx, 1);
      global.SoundFX.click();
      persistProgress();
    } else {
      state.readChapters.push(ch);
      state.readChapters.sort((a, b) => a - b);
      addPoints(5);
      global.SoundFX.correct();
    }
    state.backupMsg = 'Progresso salvo no cache do navegador.';
    render();
  }

  function renderStudyView() {
    const tabs = [
      { id: 'overview', label: 'Panorama & 5 Discursos', icon: 'layers' },
      { id: 'genealogy', label: 'Genealogia & 5 Mulheres', icon: 'scroll' },
      { id: 'geography', label: 'Mapa da Jornada', icon: 'compass' },
      { id: 'curiosities', label: 'Curiosidades & Comum', icon: 'lightbulb' },
      { id: 'chapters', label: `Leitura (${state.readChapters.length}/28)`, icon: 'list-checks' }
    ];

    let bodyHtml = '';
    if (state.studyTab === 'overview') {
      const ov = STUDY_DATA.overview;
      bodyHtml = `
        <div class="study-grid" style="margin-bottom:1.25rem;">
          <div class="study-card">
            <h3>Autor e Contexto Histórico</h3>
            <p><strong>Autoria:</strong> ${escapeHtml(ov.author)}</p>
            <p><strong>Datação estimada:</strong> ${escapeHtml(ov.date)}</p>
            <p><strong>Público:</strong> ${escapeHtml(ov.audience)}</p>
          </div>
          <div class="study-card">
            <h3>Propósito e Eixo Central</h3>
            <p><strong>Propósito:</strong> ${escapeHtml(ov.purpose)}</p>
            <p><strong>Eixo Central:</strong> ${escapeHtml(ov.centralAxis)}</p>
          </div>
        </div>
        <h3 style="margin:0 0 0.75rem; font-family:var(--font-serif);">Os Cinco Grandes Discursos de Mateus</h3>
        <div class="study-grid">
          ${STUDY_DATA.fiveDiscourses.map((d) => `
            <div class="study-card">
              <span class="tag-chip" style="margin-bottom:0.45rem;">${escapeHtml(d.chapters)}</span>
              <h4>${escapeHtml(d.title)}</h4>
              <p>${escapeHtml(d.summary)}</p>
            </div>
          `).join('')}
        </div>
      `;
    } else if (state.studyTab === 'genealogy') {
      const gen = STUDY_DATA.genealogy;
      bodyHtml = `
        <div class="study-grid study-grid-3" style="margin-bottom:1.25rem;">
          ${gen.blocks.map((b) => `
            <div class="study-card">
              <span class="tag-chip" style="margin-bottom:0.45rem;">${b.number} gerações &bull; ${escapeHtml(b.era)}</span>
              <h4>${escapeHtml(b.title)}</h4>
              <p style="margin-bottom:0.55rem; color:#f8fafc;">${escapeHtml(b.names)}</p>
              <p>${escapeHtml(b.note)}</p>
            </div>
          `).join('')}
        </div>
        <h3 style="margin:0 0 0.75rem; font-family:var(--font-serif);">As Cinco Mulheres na Genealogia</h3>
        <div class="study-grid" style="margin-bottom:1.25rem;">
          ${gen.women.map((w) => `
            <div class="study-card">
              <span class="tag-chip" style="margin-bottom:0.4rem;">${escapeHtml(w.ref)}</span>
              <h4>${escapeHtml(w.name)}</h4>
              <p>${escapeHtml(w.desc)}</p>
            </div>
          `).join('')}
        </div>
        <div class="study-card">
          <h3>Mateus 1 vs. Lucas 3: Duas Perspectivas</h3>
          <table class="study-table">
            <thead>
              <tr><th>Critério</th><th>Mateus 1:1–17</th><th>Lucas 3:23–38</th></tr>
            </thead>
            <tbody>
              ${gen.comparison.map((row) => `
                <tr>
                  <td><strong>${escapeHtml(row.criterion)}</strong></td>
                  <td>${escapeHtml(row.matthew)}</td>
                  <td>${escapeHtml(row.luke)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (state.studyTab === 'geography') {
      const geo = STUDY_DATA.geography;
      bodyHtml = `
        <h3 style="margin:0 0 0.75rem; font-family:var(--font-serif);">Linha do Tempo Geográfica em 6 Etapas</h3>
        <div class="study-grid" style="margin-bottom:1.25rem;">
          ${geo.stages.map((st) => `
            <div class="study-card">
              <span class="tag-chip" style="margin-bottom:0.4rem;">${escapeHtml(st.step)}</span>
              <h4>${escapeHtml(st.route)}</h4>
              <p>${escapeHtml(st.detail)}</p>
            </div>
          `).join('')}
        </div>
        <div class="study-card">
          <p style="font-size:0.86rem;">
            <strong>Nota do guia:</strong> os montes do Sermão (Mt 5), da Transfiguração (Mt 17) e da Grande Comissão (Mt 28) não são nomeados explicitamente no texto bíblico de Mateus.
          </p>
        </div>
      `;
    } else if (state.studyTab === 'curiosities') {
      bodyHtml = `
        <div class="study-grid" style="margin-bottom:1.35rem;">
          ${STUDY_DATA.curiosities.map((c) => `
            <div class="study-card">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem;">
                <span class="tag-chip">${escapeHtml(c.ref)}</span>
                <span data-icon="${c.icon}" data-icon-class="icon-md" style="color:var(--accent);"></span>
              </div>
              <h4>${escapeHtml(c.title)}</h4>
              <p>${escapeHtml(c.text)}</p>
            </div>
          `).join('')}
        </div>

        <div class="study-card">
          <h3>Nossa Comum Congregação ao Fundo</h3>
          <p>Clique em uma das três fotos reais da nossa Comum para visualizar no plano de fundo do portal:</p>
          <div class="church-gallery">
            ${Object.values(CHURCH_BACKGROUNDS).map((bg) => `
              <div class="church-thumb" data-pick-bg="${bg.id}">
                <img src="${bg.src}" alt="${escapeHtml(bg.label)}">
                <div class="church-thumb-cap">
                  <span>${escapeHtml(bg.label)}</span>
                  <span data-icon="${bg.theme === 'night' ? 'moon' : 'sun'}" data-icon-class="icon-xs"></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      bodyHtml = `
        <div class="study-card" style="margin-bottom:1rem; display:flex; flex-direction:column; gap:0.75rem;">
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem;">
            <div>
              <p style="margin:0; color:var(--text-main); font-size:0.94rem; font-weight:600;">
                Clique em cada capítulo conforme for lendo na sua Bíblia (+5 pontos por capítulo marcado!).
              </p>
              <span style="font-size:0.8rem; color:var(--text-muted);">
                ${state.backupMsg ? escapeHtml(state.backupMsg) : 'Seu progresso fica salvo automaticamente no cache deste navegador (localStorage + IndexedDB + Cache).'}
              </span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
              <span class="tag-chip">${state.readChapters.length} de 28 capítulos lidos</span>
              <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-backup" title="Copiar código para guardar ou levar para outro navegador">
                <span data-icon="shield" data-icon-class="icon-xs"></span>
                <span>Copiar Código</span>
              </button>
              <button type="button" class="btn btn-accent-blue btn-sm" id="btn-toggle-restore">
                <span data-icon="refresh" data-icon-class="icon-xs"></span>
                <span>Restaurar Código</span>
              </button>
            </div>
          </div>
          ${state.showRestoreBox ? `
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap; padding-top:0.4rem; border-top:1px solid var(--border);">
              <input type="text" id="input-restore-code" placeholder="Cole aqui o código MTCCB-..." style="flex:1; min-width:220px; padding:0.5rem 0.75rem; border-radius:8px; border:1px solid var(--border); background:rgba(0,0,0,0.35); color:#fff; font-size:0.86rem;">
              <button type="button" class="btn btn-primary btn-sm" id="btn-apply-restore">Aplicar</button>
            </div>
          ` : ''}
        </div>
        <div class="chapters-grid">
          ${STUDY_DATA.chapters.map((item) => {
            const isRead = state.readChapters.includes(item.ch);
            return `
              <button type="button" class="chapter-tile ${isRead ? 'is-read' : ''}" data-toggle-ch="${item.ch}">
                <span class="chapter-check">
                  ${isRead ? '<span data-icon="check" data-icon-class="icon-xs"></span>' : ''}
                </span>
                <div>
                  <strong style="display:block; font-size:0.92rem; margin-bottom:0.2rem;">Mateus ${item.ch}: ${escapeHtml(item.title)}</strong>
                  <span style="font-size:0.8rem; color:var(--text-muted); line-height:1.4; display:block;">${escapeHtml(item.summary)}</span>
                </div>
              </button>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <div class="glass-card">
        <div class="game-topbar">
          <div class="game-title-group">
            <span data-icon="book-open" data-icon-class="icon-md"></span>
            <h2>Guia de Estudo, Curiosidades &amp; 28 Capítulos</h2>
          </div>
        </div>
        <div class="study-subnav">
          ${tabs.map((t) => `
            <button type="button" class="filter-pill ${state.studyTab === t.id ? 'is-active' : ''}" data-study-tab="${t.id}">
              <span data-icon="${t.icon}" data-icon-class="icon-xs"></span>
              <span>${t.label}</span>
            </button>
          `).join('')}
        </div>
        ${bodyHtml}
      </div>
    `;
  }

  function bindStudyEvents() {
    document.querySelectorAll('[data-study-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        global.SoundFX.click();
        state.studyTab = btn.dataset.studyTab;
        render();
      });
    });

    document.querySelectorAll('[data-toggle-ch]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleChapterRead(Number(btn.dataset.toggleCh));
      });
    });

    document.querySelectorAll('[data-pick-bg]').forEach((card) => {
      card.addEventListener('click', () => {
        global.SoundFX.click();
        state.bgMode = card.dataset.pickBg;
        applyBackground(state.view);
      });
    });

    const copyBtn = document.getElementById('btn-copy-backup');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const code = global.ProgressCache.exportCode({
          score: state.score,
          bestStreak: state.bestStreak,
          readChapters: state.readChapters,
          sound: global.SoundFX.isEnabled()
        });
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(() => {
            state.backupMsg = `Código copiado! (${code})`;
            render();
          }).catch(() => {
            state.backupMsg = `Seu código de progresso: ${code}`;
            render();
          });
        } else {
          state.backupMsg = `Seu código de progresso: ${code}`;
          render();
        }
      });
    }

    const toggleRestoreBtn = document.getElementById('btn-toggle-restore');
    if (toggleRestoreBtn) {
      toggleRestoreBtn.addEventListener('click', () => {
        global.SoundFX.click();
        state.showRestoreBox = !state.showRestoreBox;
        render();
      });
    }

    const applyRestoreBtn = document.getElementById('btn-apply-restore');
    if (applyRestoreBtn) {
      applyRestoreBtn.addEventListener('click', () => {
        const input = document.getElementById('input-restore-code');
        try {
          const restored = global.ProgressCache.importCode(input ? input.value : '');
          state.score = restored.score;
          state.bestStreak = restored.bestStreak;
          state.readChapters = restored.readChapters.slice();
          state.showRestoreBox = false;
          state.backupMsg = `Progresso restaurado com sucesso (${state.readChapters.length}/28 capítulos)!`;
          global.SoundFX.correct();
          updateHUD();
          render();
        } catch (err) {
          state.backupMsg = err && err.message ? err.message : 'Código inválido.';
          global.SoundFX.wrong();
          render();
        }
      });
    }
  }

  // ---------- Inicialização ----------
  function init() {
    global.Icons.hydrate(document);
    updateHUD();

    if (!initialCache.sound) {
      global.SoundFX.setEnabled(false);
    }
    syncSoundButton();

    global.ProgressCache.hydrateAsync().then((hydrated) => {
      const changed =
        hydrated.score !== state.score ||
        hydrated.bestStreak !== state.bestStreak ||
        hydrated.readChapters.length !== state.readChapters.length;
      state.score = hydrated.score;
      state.bestStreak = hydrated.bestStreak;
      state.readChapters = hydrated.readChapters.slice();
      global.SoundFX.setEnabled(hydrated.sound);
      syncSoundButton();
      updateHUD();
      if (changed) render();
    });

    document.querySelectorAll('.nav-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        global.SoundFX.click();
        setView(btn.dataset.view);
      });
    });

    const brandHome = document.getElementById('brand-home');
    if (brandHome) {
      brandHome.addEventListener('click', () => {
        global.SoundFX.click();
        setView('home');
      });
      brandHome.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setView('home');
        }
      });
    }

    const bgBtn = document.getElementById('btn-bg-cycle');
    if (bgBtn) bgBtn.addEventListener('click', cycleBgMode);

    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const nowEnabled = global.SoundFX.toggle();
        persistProgress();
        syncSoundButton();
        if (nowEnabled) global.SoundFX.click();
      });
    }

    // Suporte ao teclado físico para "Acerte a Palavra"
    document.addEventListener('keydown', (e) => {
      if (state.view === 'word' && !state.word.finished && !e.ctrlKey && !e.metaKey && !e.altKey) {
        if (e.key && e.key.length === 1) {
          guessWordLetter(e.key);
        }
      }
    });

    applyBackground('home');
    render();
  }

  function syncSoundButton() {
    const btn = document.getElementById('btn-sound-toggle');
    const icon = document.getElementById('sound-icon');
    const on = global.SoundFX.isEnabled();
    if (btn) btn.setAttribute('aria-pressed', String(on));
    if (icon) icon.innerHTML = global.Icons.get(on ? 'volume-2' : 'volume-x', 'icon-sm');
  }

  document.addEventListener('DOMContentLoaded', init);
})(window);
