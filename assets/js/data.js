/**
 * Banco de Dados Estruturado - Evangelho de Mateus (CCB Jovens e Menores)
 * Conteúdo integralmente baseado nos 28 capítulos do Evangelho segundo Mateus
 * e nos documentos de estudo da pasta (Genealogia, História Completa e Guia Completo).
 */
(function (global) {
  'use strict';

  const CHURCH_BACKGROUNDS = {
    sunset1: {
      id: 'sunset1',
      src: 'assets/images/igreja-entardecer-1.jpg',
      label: 'Entardecer na Comum (Visão Geral)',
      theme: 'dusk'
    },
    sunset2: {
      id: 'sunset2',
      src: 'assets/images/igreja-entardecer-2.jpg',
      label: 'Entardecer na Comum (Fachada)',
      theme: 'dusk'
    },
    night: {
      id: 'night',
      src: 'assets/images/igreja-noite.jpg',
      label: 'Noite de Vigília na Comum',
      theme: 'night'
    }
  };

  // =====================================================================
  // 1. QUIZ DA PALAVRA (Múltipla Escolha - Fácil/Crianças, Médio/Jovens, Avançado/PDFs)
  // =====================================================================
  const QUIZ_QUESTIONS = [
    // --- FÁCIL (Crianças e Menores) ---
    {
      id: 'q1',
      level: 'facil',
      topic: 'Nascimento e Infância',
      ref: 'Mateus 2:1-11',
      question: 'Em qual cidade Jesus nasceu, recebendo a visita dos magos do Oriente?',
      options: ['Cafarnaum', 'Belém', 'Nazaré', 'Jericó'],
      answer: 1,
      explanation: 'Jesus nasceu em Belém da Judeia. Guiados pela estrela, os magos ofereceram ouro, incenso e mirra.'
    },
    {
      id: 'q2',
      level: 'facil',
      topic: 'Nascimento e Infância',
      ref: 'Mateus 2:11',
      question: 'Quais foram os três presentes que os magos trouxeram ao menino Jesus?',
      options: ['Prata, azeite e trigo', 'Ouro, incenso e mirra', 'Bronze, linho e mel', 'Ouro, pérolas e sal'],
      answer: 1,
      explanation: 'Ao entrarem na casa, adoraram o menino e abriram seus tesouros: ouro, incenso e mirra (Mt 2:11).'
    },
    {
      id: 'q3',
      level: 'facil',
      topic: 'Nascimento e Infância',
      ref: 'Mateus 1:23',
      question: 'Qual é o significado do nome Emanuel, citado em Mateus 1:23?',
      options: ['Rei eterno', 'Deus conosco', 'Luz do mundo', 'Filho da paz'],
      answer: 1,
      explanation: 'Cumprindo a profecia de Isaías, Emanuel significa "Deus conosco", mostrando a presença divina entre o povo.'
    },
    {
      id: 'q4',
      level: 'facil',
      topic: 'Batismo e Início',
      ref: 'Mateus 3:13-17',
      question: 'Quem batizou Jesus no Rio Jordão, e em que forma o Espírito Santo desceu sobre Ele?',
      options: ['Pedro, como chama de fogo', 'João Batista, como pomba', 'Mateus, como nuvem branca', 'André, como vento forte'],
      answer: 1,
      explanation: 'João Batista batizou Jesus no Jordão. O Espírito desceu como pomba e a voz do Pai o proclamou Filho amado.'
    },
    {
      id: 'q5',
      level: 'facil',
      topic: 'Tentação no Deserto',
      ref: 'Mateus 4:1-2',
      question: 'Por quantos dias e noites Jesus jejuou no deserto antes de ser tentado?',
      options: ['7 dias e 7 noites', '12 dias e 12 noites', '40 dias e 40 noites', '3 dias e 3 noites'],
      answer: 2,
      explanation: 'Jesus jejuou 40 dias e 40 noites no deserto e venceu todas as três tentações citando o livro de Deuteronômio.'
    },
    {
      id: 'q6',
      level: 'facil',
      topic: 'Chamado dos Discípulos',
      ref: 'Mateus 9:9',
      question: 'Qual era a profissão de Mateus (Levi) quando Jesus o chamou para segui-lo?',
      options: ['Pescador de peixes', 'Carpinteiro', 'Cobrador de impostos na coletoria', 'Soldado romano'],
      answer: 2,
      explanation: 'Como retratado em nossos estudos, Mateus estava sentado na coletoria de impostos quando Jesus disse: "Segue-me" (Mt 9:9).'
    },
    {
      id: 'q7',
      level: 'facil',
      topic: 'Milagres',
      ref: 'Mateus 14:17-21',
      question: 'Na primeira multiplicação dos pães, o que os discípulos tinham disponível para alimentar cinco mil homens?',
      options: ['Sete pães e poucos peixinhos', 'Cinco pães e dois peixes', 'Três pães e um jarro de água', 'Doze cestos de trigo'],
      answer: 1,
      explanation: 'Com cinco pães e dois peixes, Jesus abençoou, alimentou cerca de cinco mil homens (além de mulheres e crianças) e ainda sobraram doze cestos.'
    },
    {
      id: 'q8',
      level: 'facil',
      topic: 'Milagres no Mar',
      ref: 'Mateus 14:28-31',
      question: 'Qual discípulo pediu para caminhar sobre as águas até Jesus, mas começou a afundar ao temer o vento?',
      options: ['João', 'Tiago', 'Pedro', 'Tomé'],
      answer: 2,
      explanation: 'Pedro andou sobre o mar, mas ao reparar no vento forte teve medo e afundou; Jesus logo estendeu a mão e o segurou.'
    },
    {
      id: 'q9',
      level: 'facil',
      topic: 'Sermão do Monte',
      ref: 'Mateus 7:24-27',
      question: 'Na parábola ao final do Sermão do Monte, quem ouve e pratica as palavras de Jesus é comparado ao homem prudente que edificou sua casa sobre:',
      options: ['A areia da praia', 'A rocha', 'Um vale verde', 'Madeira de cedro'],
      answer: 1,
      explanation: 'Quem ouve e pratica as palavras de Cristo é semelhante ao homem prudente que edificou sua casa sobre a rocha (Mt 7:24).'
    },
    {
      id: 'q10',
      level: 'facil',
      topic: 'Paixão e Traição',
      ref: 'Mateus 26:14-15',
      question: 'Por quantas moedas de prata Judas Iscariotes negociou a entrega de Jesus?',
      options: ['12 moedas', '30 moedas', '50 moedas', '100 moedas'],
      answer: 1,
      explanation: 'Judas negociou com os principais sacerdotes por 30 moedas de prata e entregou Jesus com um beijo no Getsêmani (Mt 26:14-49).'
    },
    {
      id: 'q11',
      level: 'facil',
      topic: 'Ressurreição',
      ref: 'Mateus 28:1-6',
      question: 'Quem apareceu no túmulo vazio removendo a pedra e anunciando que Jesus havia ressuscitado?',
      options: ['Um soldado romano', 'Um anjo do Senhor', 'O sumo sacerdote', 'Simão de Cirene'],
      answer: 1,
      explanation: 'Um anjo do Senhor desceu do céu, removeu a pedra e anunciou a Maria Madalena e à outra Maria: "Ele não está aqui, porque já ressuscitou" (Mt 28:2-6).'
    },
    {
      id: 'q12',
      level: 'facil',
      topic: 'Vida Comunitária',
      ref: 'Mateus 18:1-5',
      question: 'Quando os discípulos perguntaram quem era o maior no Reino dos Céus, quem Jesus colocou no meio deles como exemplo de humildade?',
      options: ['Um rei poderoso', 'Uma criança', 'Um escriba do templo', 'Um centurião'],
      answer: 1,
      explanation: 'Jesus chamou uma criança e ensinou que quem se humilhar como ela é o maior no Reino dos Céus (Mt 18:1-4).'
    },

    // --- MÉDIO (Jovens) ---
    {
      id: 'q13',
      level: 'medio',
      topic: 'Genealogia',
      ref: 'Mateus 1:17',
      question: 'Em quantos blocos simétricos de gerações Mateus organiza a genealogia de Jesus?',
      options: [
        'Dois blocos de 12 gerações',
        'Três blocos de 14 gerações',
        'Quatro blocos de 10 gerações',
        'Sete blocos de 7 gerações'
      ],
      answer: 1,
      explanation: 'Em Mt 1:17, Mateus organiza a história em 3 blocos de 14 gerações: de Abraão a Davi, de Davi ao Exílio, e do Exílio até Cristo.'
    },
    {
      id: 'q14',
      level: 'medio',
      topic: 'Fuga para o Egito',
      ref: 'Mateus 2:13-23',
      question: 'Por que José fugiu com Maria e o menino Jesus para o Egito e depois foi morar em Nazaré?',
      options: [
        'Para visitar parentes de Abraão',
        'Por causa da perseguição de Herodes em Belém',
        'Para fugir de uma tempestade no Jordão',
        'Porque o templo havia sido fechado'
      ],
      answer: 1,
      explanation: 'Avisado por um anjo em sonho, José fugiu para o Egito para proteger Jesus da perseguição de Herodes e depois estabeleceu residência em Nazaré.'
    },
    {
      id: 'q15',
      level: 'medio',
      topic: 'Base Ministerial',
      ref: 'Mateus 4:12-13',
      question: 'Após a prisão de João Batista, em qual cidade à beira do mar Jesus fixou sua base ministerial?',
      options: ['Jericó', 'Cafarnaum', 'Samaria', 'Tiro'],
      answer: 1,
      explanation: 'Jesus deixou Nazaré e foi morar em Cafarnaum, cidade junto ao Mar da Galileia, iniciando ali intensa pregação e curas (Mt 4:13-25).'
    },
    {
      id: 'q16',
      level: 'medio',
      topic: 'Sermão do Monte',
      ref: 'Mateus 5:13-16',
      question: 'No início do Sermão do Monte, Jesus compara seus discípulos a quais dois elementos essenciais?',
      options: [
        'Ouro e prata',
        'Sal da terra e luz do mundo',
        'Água viva e vento',
        'Pão e vinho'
      ],
      answer: 1,
      explanation: 'Em Mateus 5:13-14, Jesus declara aos discípulos: "Vós sois o sal da terra" e "Vós sois a luz do mundo".'
    },
    {
      id: 'q17',
      level: 'medio',
      topic: 'Milagres e Fé',
      ref: 'Mateus 15:21-28',
      question: 'Em qual região Jesus elogiou a grande fé de uma mulher cananeia e curou sua filha?',
      options: [
        'Região de Tiro e Sidom',
        'Deserto da Judeia',
        'Monte das Oliveiras',
        'Cidade de Betânia'
      ],
      answer: 0,
      explanation: 'Retirando-se para os lados de Tiro e Sidom, Jesus atendeu à perseverança da mulher cananeia: "Ó mulher, grande é a tua fé!" (Mt 15:28).'
    },
    {
      id: 'q18',
      level: 'medio',
      topic: 'Transfiguração',
      ref: 'Mateus 17:1-8',
      question: 'Quais dois personagens do Antigo Testamento apareceram conversando com Jesus no monte da Transfiguração diante de Pedro, Tiago e João?',
      options: [
        'Abraão e Davi',
        'Moisés e Elias',
        'Isaías e Jeremias',
        'Noé e Jonas'
      ],
      answer: 1,
      explanation: 'Moisés (representando a Lei) e Elias (os Profetas) apareceram conversando com Jesus transfigurado diante dos três discípulos (Mt 17:3).'
    },
    {
      id: 'q19',
      level: 'medio',
      topic: 'Milagre do Imposto',
      ref: 'Mateus 17:24-27',
      question: 'Como Jesus orientou Pedro a pagar o imposto do templo em Cafarnaum?',
      options: [
        'Pedindo emprestado a Mateus',
        'Vendendo a rede do barco',
        'Pescando um peixe que teria uma moeda na boca',
        'Usando uma oferta dos magos'
      ],
      answer: 2,
      explanation: 'Jesus mandou Pedro lançar o anzol ao mar e abrir a boca do primeiro peixe, onde encontrou um estáter (moeda) para pagar por ambos (Mt 17:27).'
    },
    {
      id: 'q20',
      level: 'medio',
      topic: 'O Maior Mandamento',
      ref: 'Mateus 22:37-40',
      question: 'Ao ser questionado pelos fariseus, como Jesus resumiu toda a Lei e os Profetas?',
      options: [
        'Jejuar duas vezes por semana e guardar o sábado',
        'Amar a Deus sobre todas as coisas e ao próximo como a si mesmo',
        'Oferecer sacrifícios diários no templo de Jerusalém',
        'Memorizar todas as gerações desde Abraão'
      ],
      answer: 1,
      explanation: 'Em Mt 22:37-40, Jesus ensinou que amar o Senhor de todo o coração e amar o próximo como a si mesmo resumem toda a Lei e os Profetas.'
    },
    {
      id: 'q21',
      level: 'medio',
      topic: 'Parábolas Proféticas',
      ref: 'Mateus 25:1-13',
      question: 'Na parábola das Dez Virgens, o que diferenciou as cinco prudentes das cinco loucas enquanto aguardavam o noivo?',
      options: [
        'Elas tinham roupas mais caras',
        'Levaram azeite de reserva em suas vasilhas além das lâmpadas',
        'Conheciam o dia exato da chegada do noivo',
        'Ficaram acordadas sem piscar durante três noites'
      ],
      answer: 1,
      explanation: 'As prudentes levaram azeite de reserva nas vasilhas com suas lâmpadas, simbolizando preparação espiritual constante (Mt 25:4).'
    },
    {
      id: 'q22',
      level: 'medio',
      topic: 'Cruz e Morte',
      ref: 'Mateus 27:32-54',
      question: 'Quem foi obrigado a carregar a cruz de Jesus até o Gólgota e quem cedeu um túmulo novo para sepultá-lo?',
      options: [
        'Barrabás e Nicodemos',
        'Simão de Cirene e José de Arimateia',
        'Zaqueu e Lázaro',
        'Pedro e Caifás'
      ],
      answer: 1,
      explanation: 'Simão de Cirene carregou a cruz até o Gólgota (Mt 27:32) e José de Arimateia envolveu o corpo em lençol limpo e o colocou em seu túmulo novo (Mt 27:57-60).'
    },
    {
      id: 'q23',
      level: 'medio',
      topic: 'Grande Comissão',
      ref: 'Mateus 28:18-20',
      question: 'Qual é a promessa final de Jesus no último versículo do Evangelho de Mateus?',
      options: [
        'Voltarei no próximo domingo em Cafarnaum',
        'Eis que estou convosco todos os dias, até à consumação dos séculos',
        'Nenhuma tempestade jamais atingirá a Galileia',
        'Construireis um novo templo de pedra em Nazaré'
      ],
      answer: 1,
      explanation: 'Mt 28:20 encerra o livro com a promessa consoladora de Cristo Rei presente: "Eis que estou convosco todos os dias, até à consumação dos séculos."'
    },
    {
      id: 'q24',
      level: 'medio',
      topic: 'Perdão Comunitário',
      ref: 'Mateus 18:21-22',
      question: 'Quando Pedro perguntou se deveria perdoar ao irmão até sete vezes, o que Jesus respondeu?',
      options: [
        'Apenas três vezes são suficientes',
        'Não te digo que até sete, mas até setenta vezes sete',
        'Somente se ele pedir por escrito',
        'Uma vez por ano na Páscoa'
      ],
      answer: 1,
      explanation: 'Jesus respondeu "até setenta vezes sete" e contou a parábola do servo impiedoso, ensinando que o perdão cristão deve ser ilimitado (Mt 18:21-35).'
    },

    // --- AVANÇADO (Estudo Detalhado dos Documentos PDF) ---
    {
      id: 'q25',
      level: 'avancado',
      topic: 'Genealogia e Gematria',
      ref: 'PDF Genealogia (Pág. 3) / Mt 1:17',
      question: 'Qual curiosidade numérica hebraica (gematria) explica a escolha do número 14 nos três blocos da genealogia de Mateus?',
      options: [
        'O número de meses do calendário judaico',
        'O valor numérico das letras do nome "Davi" (D-V-D) soma exatamente 14',
        'Havia exatamente 14 tribos de Israel na Galileia',
        'Mateus escreveu o livro em 14 dias'
      ],
      answer: 1,
      explanation: 'Conforme destaca o estudo da Genealogia (pág. 3), no alfabeto hebraico as consoantes de Davi (Dalet=4, Vav=6, Dalet=4) somam 14.'
    },
    {
      id: 'q26',
      level: 'avancado',
      topic: 'Mulheres na Genealogia',
      ref: 'PDF Genealogia (Pág. 7) / Mt 1:3-16',
      question: 'Quais são as cinco mulheres mencionadas na genealogia de Jesus em Mateus 1?',
      options: [
        'Sara, Rebeca, Raquel, Léa e Maria',
        'Tamar, Raabe, Rute, Mulher de Urias (Bate-Seba) e Maria',
        'Miriã, Débora, Ester, Rute e Isabel',
        'Eva, Sara, Raabe, Ana e Maria'
      ],
      answer: 1,
      explanation: 'Mateus 1 destaca cinco mulheres: Tamar (1:3), Raabe (1:5), Rute (1:5), Bate-Seba - mulher de Urias (1:6) e Maria (1:16), revelando a graça redentora de Deus.'
    },
    {
      id: 'q27',
      level: 'avancado',
      topic: 'Mateus vs Lucas',
      ref: 'PDF Genealogia (Pág. 9)',
      question: 'Comparando Mateus 1 e Lucas 3, qual diferença é verdadeira sobre a genealogia de Jesus?',
      options: [
        'Mateus vai em ordem ascendente até Adão e cita Natã',
        'Mateus vai em ordem descendente de Abraão até Jesus, passando por Salomão (linhagem real legal)',
        'Lucas começa em Davi e termina em Moisés',
        'Ambos trazem exatamente a mesma lista de nomes'
      ],
      answer: 1,
      explanation: 'Mateus 1:1-17 é descendente (Abraão até Jesus), passa por Salomão e enfatiza Jesus como Rei Messias de Israel; Lucas 3 sobe até Adão passando por Natã.'
    },
    {
      id: 'q28',
      level: 'avancado',
      topic: 'Ruptura na Genealogia',
      ref: 'PDF Genealogia (Pág. 8) / Mt 1:16',
      question: 'No versículo 16 da genealogia de Mateus, qual mudança verbal proposital acontece ao chegar a José?',
      options: [
        'Troca-se "gerou" por "adotou em Belém"',
        'Troca-se "gerou" por "marido de Maria, da qual nasceu Jesus"',
        'Não se menciona o nome de José no texto',
        'Diz-se que José gerou Jesus em Nazaré'
      ],
      answer: 1,
      explanation: 'Até Jacó o texto repete "gerou". Em Mt 1:16 muda para "José, marido de Maria, da qual nasceu Jesus", marcando o nascimento virginal pelo Espírito Santo.'
    },
    {
      id: 'q29',
      level: 'avancado',
      topic: 'Cinco Grandes Discursos',
      ref: 'PDF Guia Completo (Pág. 4)',
      question: 'O Evangelho de Mateus é estruturado em torno de Cinco Grandes Discursos de Jesus. Quais são eles?',
      options: [
        'Caps 1-2, 4, 9, 15 e 21',
        'Sermão do Monte (5-7), Envio dos Doze (10), Parábolas do Reino (13), Vida Comunitária (18) e Discurso Profético (24-25)',
        'Batismo (3), Tentação (4), Transfiguração (17), Ceia (26) e Ressurreição (28)',
        'Genealogia (1), Milagres (8-9), Lamento (23), Cruz (27) e Envio (28)'
      ],
      answer: 1,
      explanation: 'Conforme o Guia Completo (pág. 4), os 5 Grandes Discursos são: Mt 5-7, Mt 10, Mt 13, Mt 18 e Mt 24-25.'
    },
    {
      id: 'q30',
      level: 'avancado',
      topic: 'Contexto Histórico',
      ref: 'PDF Guia Completo (Pág. 2) & História (Pág. 2)',
      question: 'Segundo os guias de estudo da pasta, qual é a datação estimada e o público original do Evangelho de Mateus?',
      options: [
        'Escrito em 35 d.C. apenas para gregos em Atenas',
        'Redação estimada entre 80 e 90 d.C. para comunidades mistas de forte raiz judaica',
        'Escrito em 150 d.C. exclusivamente para soldados romanos',
        'Escrito antes do nascimento de João Batista'
      ],
      answer: 1,
      explanation: 'Os guias apontam autoria atribuída a Levi Mateus, redação estimada entre 80 e 90 d.C. e público de comunidades mistas de raiz judaica.'
    },
    {
      id: 'q31',
      level: 'avancado',
      topic: 'Retorno do Egito',
      ref: 'Mateus 2:22-23',
      question: 'Ao retornar do Egito com Maria e o menino Jesus, por que José temeu ir para a Judeia e retirou-se para as partes da Galileia?',
      options: [
        'Porque o Rio Jordão havia transbordado',
        'Porque soube que Arquelau reinava na Judeia em lugar de seu pai Herodes',
        'Porque os magos o aconselharam a ir para Samaria',
        'Porque Pôncio Pilatos proibiu a entrada em Belém'
      ],
      answer: 1,
      explanation: 'Em Mt 2:22, José soube que Arquelau reinava na Judeia no lugar de Herodes, e, avisado em sonho, foi habitar em Nazaré da Galileia.'
    },
    {
      id: 'q32',
      level: 'avancado',
      topic: 'Geografia e Texto Bíblico',
      ref: 'PDF Guia Completo (Pág. 13)',
      question: 'Segundo a nota geográfica do Guia Completo, o que o texto de Mateus tem em comum quanto aos montes do Sermão, da Transfiguração e da Grande Comissão?',
      options: [
        'Todos são chamados de Monte Sinai no texto',
        'Nenhum dos três montes é nomeado explicitamente no texto de Mateus',
        'Todos ficam dentro da cidade de Jericó',
        'Todos ficam às margens do Rio Jordão'
      ],
      answer: 1,
      explanation: 'A nota da pág. 13 explica que os montes do Sermão (Mt 5), da Transfiguração (Mt 17) e da Grande Comissão (Mt 28) não são nomeados no texto.'
    },
    {
      id: 'q33',
      level: 'avancado',
      topic: 'Sinal e Controvérsias',
      ref: 'Mateus 12:38-42 / PDF História (Pág. 8)',
      question: 'Quando escribas e fariseus pediram um sinal em Mateus 12, qual sinal do Antigo Testamento Jesus citou como referência à sua morte e ressurreição?',
      options: [
        'O sinal do arco-íris de Noé',
        'O sinal do profeta Jonas (três dias e três noites)',
        'O sinal da sarça ardente',
        'O sinal da queda das muralhas de Jericó'
      ],
      answer: 1,
      explanation: 'Jesus recusou sinais espetaculares e apontou o sinal de Jonas: assim como Jonas esteve três dias no ventre do grande peixe, o Filho do Homem estaria no seio da terra.'
    },
    {
      id: 'q34',
      level: 'avancado',
      topic: 'Confissão de Pedro',
      ref: 'Mateus 16:13-16 / PDF História (Pág. 10)',
      question: 'Em qual região Jesus perguntou "Quem dizeis que eu sou?" e ouviu Pedro confessar "Tu és o Cristo, o Filho do Deus vivo"?',
      options: [
        'Cesareia de Filipe',
        'Betfagé',
        'Genesaré',
        'Corazim'
      ],
      answer: 0,
      explanation: 'Foi nas cercanias de Cesareia de Filipe (Mt 16:13-16) que Pedro fez sua confissão messiânica.'
    },
    {
      id: 'q35',
      level: 'avancado',
      topic: 'Eventos da Crucificação',
      ref: 'Mateus 27:51-54 / PDF História (Pág. 15)',
      question: 'O que aconteceu no Templo de Jerusalém no momento exato em que Jesus entregou o espírito na cruz, simbolizando livre acesso a Deus?',
      options: [
        'As portas de bronze se fecharam para sempre',
        'O véu do santuário rasgou-se em dois, de alto a baixo',
        'Os sacerdotes acenderam setenta lâmpadas',
        'Uma fonte de água jorrou do altar'
      ],
      answer: 1,
      explanation: 'O véu do templo rasgou-se de alto a baixo (Mt 27:51), inaugurando o livre acesso a Deus pelo sacrifício consumado na cruz.'
    },
    {
      id: 'q36',
      level: 'avancado',
      topic: 'Linhagem Pós-Exílica',
      ref: 'PDF Genealogia (Pág. 6) / Mt 1:12',
      question: 'Quais são os dois primeiros nomes que inauguram o 3º Bloco da genealogia de Jesus (do Exílio até Cristo)?',
      options: [
        'Roboão e Abias',
        'Salatiel e Zorobabel',
        'Perez e Esrom',
        'Eliúde e Eleazar'
      ],
      answer: 1,
      explanation: 'Após a deportação para a Babilônia (Jeconias), o 3º bloco inicia com Salatiel e Zorobabel (Mt 1:12), preservando a linhagem no período silencioso.'
    },
    {
      id: 'q37',
      level: 'avancado',
      topic: 'Sermão do Monte (Juízos)',
      ref: 'Mateus 5:22',
      question: 'Em Mateus 5:22, ao ensinar sobre a ira sem motivo, Jesus afirma que quem chamar seu irmão de "Raca" fica sujeito a qual tribunal?',
      options: [
        'Ao juízo dos anciãos de Cafarnaum',
        'Ao Sinédrio (Conselho)',
        'À prisão diante do centurião',
        'Ao pagamento de dois estáteres'
      ],
      answer: 1,
      explanation: 'Em Mt 5:22, quem se irar fica sujeito a julgamento; quem disser "Raca" (tolo/vazio) fica sujeito ao Sinédrio (Conselho); e quem chamar de louco, ao fogo do inferno.'
    },
    {
      id: 'q38',
      level: 'avancado',
      topic: 'Cidades Incrédulas',
      ref: 'Mateus 11:20-24',
      question: 'Quais são as três cidades da Galileia contra as quais Jesus pronunciou juízo severo por não se arrependerem apesar dos seus prodígios?',
      options: [
        'Nazaré, Caná e Naim',
        'Corazim, Betsaida e Cafarnaum',
        'Jericó, Betânia e Emaús',
        'Tiro, Sidom e Cesareia'
      ],
      answer: 1,
      explanation: 'Em Mt 11:21-23, Jesus repreende Corazim e Betsaida (comparando-as a Tiro e Sidom) e Cafarnaum (comparando-a a Sodoma).'
    },
    {
      id: 'q39',
      level: 'avancado',
      topic: 'Senhor do Sábado',
      ref: 'Mateus 12:3-4',
      question: 'Para defender os discípulos que colhiam espigas no sábado, qual episódio do Antigo Testamento Jesus citou em Mateus 12:3-4?',
      options: [
        'Elias multiplicando o azeite da viúva',
        'Davi e seus companheiros comendo os pães da proposição na Casa de Deus',
        'Moisés quebrando as tábuas da Lei no Sinai',
        'Josué atravessando o Rio Jordão em seco'
      ],
      answer: 1,
      explanation: 'Jesus lembrou que Davi, tendo fome, entrou na Casa de Deus e comeu os pães da proposição, que só era lícito aos sacerdotes comer, mostrando que misericórdia vale mais que sacrifício.'
    },
    {
      id: 'q40',
      level: 'avancado',
      topic: 'Parábolas do Reino',
      ref: 'Mateus 13:36-50',
      question: 'No capítulo 13, após despedir as multidões e entrar em casa, quais três parábolas Jesus contou em particular apenas aos discípulos?',
      options: [
        'Semeador, Joio e Trigo, e Grão de Mostarda',
        'Tesouro Escondido, Pérola de Grande Valor e a Rede lançada ao mar',
        'Dez Virgens, Talentos e Ovelhas e Bodes',
        'Fermento, Trabalhadores da Vinha e Dois Filhos'
      ],
      answer: 1,
      explanation: 'Jesus falou à multidão junto ao mar o Semeador, o Joio, a Mostarda e o Fermento; depois, dentro de casa (Mt 13:36-50), explicou o Joio e contou o Tesouro Escondido, a Pérola e a Rede.'
    },
    {
      id: 'q41',
      level: 'avancado',
      topic: 'Moedas no Evangelho',
      ref: 'Mateus 17:24-27',
      question: 'Qual era o valor do imposto do templo cobrado em Cafarnaum e qual moeda exata Pedro encontrou na boca do peixe para pagar por ambos?',
      options: [
        'Cobravam dez denários; Pedro achou trinta moedas de prata',
        'Cobravam duas dracmas (didracma); Pedro achou um estáter',
        'Cobravam um ceitil; Pedro achou um talento de ouro',
        'Cobravam cinco ciclos; Pedro achou uma dracma'
      ],
      answer: 1,
      explanation: 'Em Mt 17:24-27, os cobradores arrecadavam o imposto de duas dracmas por pessoa. Pedro encontrou um estáter (equivalente a quatro dracmas), suficiente para Jesus e para ele.'
    },
    {
      id: 'q42',
      level: 'avancado',
      topic: 'Parábola do Perdão',
      ref: 'Mateus 18:24-28',
      question: 'Na parábola do servo impiedoso (Mt 18), qual era o contraste entre a dívida perdoada pelo rei e a dívida cobrada do conservo?',
      options: [
        'Cem talentos perdoados contra dez moedas de prata',
        'Dez mil talentos perdoados contra cem dinheiros (denários)',
        'Mil moedas de ouro contra cinquenta dracmas',
        'Cinco talentos perdoados contra um talento'
      ],
      answer: 1,
      explanation: 'O contraste em Mt 18:24-28 é gigantesco: o rei perdoou dez mil talentos, mas o servo não perdoou cem dinheiros (denários) do seu companheiro.'
    },
    {
      id: 'q43',
      level: 'avancado',
      topic: 'Trabalhadores da Vinha',
      ref: 'Mateus 20:1-16',
      question: 'Na parábola dos trabalhadores da vinha, quanto recebeu quem foi contratado na undécima hora (última hora do dia)?',
      options: [
        'A metade do salário diário',
        'Um dinheiro (um denário), o mesmo valor combinado com os primeiros',
        'Apenas um cesto de uvas da colheita',
        'O dobro dos trabalhadores da manhã'
      ],
      answer: 1,
      explanation: 'Todos receberam um dinheiro (Mt 20:9-14), ilustrando a generosidade soberana da graça divina: "Os últimos serão primeiros, e os primeiros, últimos".'
    },
    {
      id: 'q44',
      level: 'avancado',
      topic: 'Parábolas em Jerusalém',
      ref: 'Mateus 21:42',
      question: 'Logo após a parábola dos lavradores maus, qual passagem das Escrituras Jesus citou aos principais sacerdotes e fariseus?',
      options: [
        'A pedra que os edificadores rejeitaram tornou-se a principal pedra de esquina',
        'O Senhor é o meu pastor, nada me faltará',
        'Não só de pão viverá o homem, mas de toda palavra de Deus',
        'Eis que a virgem conceberá e dará à luz um filho'
      ],
      answer: 0,
      explanation: 'Citando o Salmo 118:22-23 em Mt 21:42, Jesus anuncia sua própria rejeição pelos líderes e exaltação por Deus como pedra angular.'
    },
    {
      id: 'q45',
      level: 'avancado',
      topic: 'Debates no Templo',
      ref: 'Mateus 22:23-33',
      question: 'Qual grupo religioso negava a ressurreição e propôs a Jesus o enigma da mulher que se casou sucessivamente com sete irmãos?',
      options: [
        'Os zelotes',
        'Os saduceus',
        'Os herodianos',
        'Os essênios'
      ],
      answer: 1,
      explanation: 'Os saduceus não criam na ressurreição (Mt 22:23). Jesus os refutou dizendo: "Errais, não conhecendo as Escrituras nem o poder de Deus".'
    },
    {
      id: 'q46',
      level: 'avancado',
      topic: 'Os Ais aos Fariseus',
      ref: 'Mateus 23:23',
      question: 'Em Mateus 23:23, Jesus repreende os escribas e fariseus por darem o dízimo meticuloso de três ervas enquanto desprezavam a justiça, a misericórdia e a fé. Quais eram essas ervas?',
      options: [
        'Trigo, cevada e oliveira',
        'Hortelã, endro e cominho',
        'Salsa, alecrim e hissopo',
        'Mostarda, figueira e videira'
      ],
      answer: 1,
      explanation: 'Em Mt 23:23: "dais o dízimo da hortelã, do endro e do cominho, e desprezais o mais importante da lei: o juízo, a misericórdia e a fé".'
    },
    {
      id: 'q47',
      level: 'avancado',
      topic: 'Lamento Profético',
      ref: 'Mateus 23:35',
      question: 'Ao anunciar que recairia sobre aquela geração todo o sangue justo derramado na terra, Jesus cita desde o sangue de Abel até o de quem?',
      options: [
        'Isaías, filho de Amós',
        'Zacarias, filho de Baraquias, morto entre o santuário e o altar',
        'João Batista, morto na prisão de Herodes',
        'Jeremias, lançado na cisterna'
      ],
      answer: 1,
      explanation: 'Em Mt 23:35, Jesus cita do primeiro mártir bíblico (Abel, em Gênesis) até Zacarias, filho de Baraquias, morto entre o santuário e o altar.'
    },
    {
      id: 'q48',
      level: 'avancado',
      topic: 'Unção em Betânia',
      ref: 'Mateus 26:6-13',
      question: 'Em Betânia, na casa de quem Jesus estava quando uma mulher derramou sobre sua cabeça um vaso de alabastro com perfume precioso?',
      options: [
        'Na casa de Caifás, o sumo sacerdote',
        'Na casa de Simão, o leproso',
        'Na casa de José de Arimateia',
        'Na casa de Nicodemos'
      ],
      answer: 1,
      explanation: 'Mateus 26:6 registra que Jesus estava em Betânia, em casa de Simão, o leproso, onde aquela mulher o ungiu para a sua sepultura.'
    },
    {
      id: 'q49',
      level: 'avancado',
      topic: 'Cumprimento Profético',
      ref: 'Mateus 27:9-10',
      question: 'Quando os principais sacerdotes usaram as 30 moedas de prata devolvidas por Judas para comprar o Campo do Oleiro, qual profeta Mateus cita nominalmente?',
      options: [
        'Profeta Daniel',
        'Profeta Jeremias',
        'Profeta Miqueias',
        'Profeta Malaquias'
      ],
      answer: 1,
      explanation: 'Em Mt 27:9, o texto cita explicitamente o nome do profeta Jeremias ao ligar a compra do Campo do Oleiro ao preço avaliado pelos filhos de Israel.'
    },
    {
      id: 'q50',
      level: 'avancado',
      topic: 'Sinais na Crucificação',
      ref: 'Mateus 27:34, 48, 52-53',
      question: 'Qual acontecimento extraordinário, registrado exclusivamente no Evangelho de Mateus, ocorreu nos sepulcros após a ressurreição de Jesus?',
      options: [
        'Fogo desceu do céu sobre o Pretório romano',
        'Abriram-se os sepulcros e muitos corpos de santos ressuscitaram, aparecendo na cidade santa',
        'As muralhas de Jerusalém caíram no mesmo instante',
        'O Mar da Galileia secou por três horas'
      ],
      answer: 1,
      explanation: 'Mateus 27:52-53 relata que as rochas se fenderam, os sepulcros se abriram e, depois da ressurreição de Jesus, muitos santos ressuscitaram e apareceram a muitos em Jerusalém.'
    }
  ];

  // =====================================================================
  // 2. QUEM SOU EU? (Acerte o Personagem do Livro de Mateus)
  // =====================================================================
  const CHARACTERS_GAME = [
    {
      id: 'c1',
      name: 'Mateus (Levi)',
      role: 'Apóstolo e Autor do Evangelho',
      ref: 'Mateus 9:9-13',
      clues: [
        'Eu trabalhava sentado na coletoria de impostos em Cafarnaum.',
        'Quando Jesus me chamou, deixei tudo, o segui e ofereci uma refeição onde Ele comeu com publicanos e pecadores.',
        'A tradição atribui a mim a escrita do primeiro livro do Novo Testamento.'
      ],
      options: ['Mateus (Levi)', 'Zaqueu', 'Simão Pedro', 'Tomé'],
      summary: 'Cobrador de impostos chamado por Jesus em Mt 9:9. Escreveu o Evangelho apresentando Jesus como o Messias prometido.'
    },
    {
      id: 'c2',
      name: 'João Batista',
      role: 'Precursor do Messias',
      ref: 'Mateus 3:1-17; 14:1-12',
      clues: [
        'Eu pregava no deserto da Judeia dizendo: "Arrependei-vos, porque está próximo o reino dos céus".',
        'Eu vestia pelos de camelo e batizei Jesus no Rio Jordão, mesmo sentindo que Ele deveria me batizar.',
        'Mais tarde fui preso e decapitado por ordem de Herodes.'
      ],
      options: ['João Batista', 'Elias', 'João Evangelista', 'Barnabé'],
      summary: 'João Batista preparou o caminho do Senhor e testemunhou o batismo trinitário de Jesus no Rio Jordão (Mt 3).'
    },
    {
      id: 'c3',
      name: 'Simão Pedro',
      role: 'Pescador e Apóstolo',
      ref: 'Mateus 4:18; 14:29; 16:16; 26:69-75',
      clues: [
        'Eu era pescador no Mar da Galileia junto com meu irmão André quando fui chamado para ser pescador de homens.',
        'Caminhei sobre as águas até ter medo do vento e confessei em Cesareia de Filipe: "Tu és o Cristo".',
        'Na noite da prisão de Jesus, neguei conhecê-lo três vezes antes que o galo cantasse, e chorei amargamente.'
      ],
      options: ['Simão Pedro', 'Tiago', 'Judas Iscariotes', 'André'],
      summary: 'Discípulo impetuoso e sincero, esteve na Transfiguração e na confissão messiânica, sendo restaurado pela graça.'
    },
    {
      id: 'c4',
      name: 'José (Esposo de Maria)',
      role: 'Pai Legal de Jesus',
      ref: 'Mateus 1:16-25; 2:13-23',
      clues: [
        'Eu sou descendente da casa de Davi e, na genealogia de Mateus 1:16, sou chamado de "marido de Maria".',
        'Recebi instruções divinas em sonhos através de um anjo para não temer receber Maria e dar ao menino o nome de Jesus.',
        'Fugi de noite com minha família para o Egito e depois fixei moradia em Nazaré.'
      ],
      options: ['José (Esposo de Maria)', 'José de Arimateia', 'Zacarias', 'Jacó'],
      summary: 'Homem justo e obediente, assumiu a paternidade legal de Jesus ao dar-lhe o nome e protegeu a família na fuga ao Egito.'
    },
    {
      id: 'c5',
      name: 'Centurião de Cafarnaum',
      role: 'Oficial Romano de Grande Fé',
      ref: 'Mateus 8:5-13',
      clues: [
        'Eu era um oficial militar gentio que comandava cem soldados em Cafarnaum.',
        'Procurei Jesus pedindo socorro para o meu criado que jazia em casa paralítico e atormentado.',
        'Disse que não era digno de recebê-lo sob meu teto e pedi: "Dize somente uma palavra, e o meu criado sarará".'
      ],
      options: ['Centurião de Cafarnaum', 'Pilatos', 'Herodes', 'Jairo'],
      summary: 'Jesus admirou-se desse oficial dizendo que nem em Israel encontrou tamanha fé (Mt 8:10).'
    },
    {
      id: 'c6',
      name: 'Mulher Cananeia',
      role: 'Mãe Perseverante na Fé',
      ref: 'Mateus 15:21-28',
      clues: [
        'Eu vivia na região de Tiro e Sidom e clamava a Jesus chamando-o de "Filho de Davi".',
        'Minha filha estava gravemente endemoninhada e eu não desisti de clamar, mesmo após um aparente silêncio.',
        'Respondi com humildade que até os cachorrinhos comem das migalhas que caem da mesa, e Jesus disse: "Grande é a tua fé!".'
      ],
      options: ['Mulher Cananeia', 'Maria Madalena', 'Raabe', 'Marta'],
      summary: 'Exemplo marcante de que a graça alcança os gentios que perseveram na fé (Mt 15:28).'
    },
    {
      id: 'c7',
      name: 'Simão de Cirene',
      role: 'Carregador da Cruz',
      ref: 'Mateus 27:32',
      clues: [
        'Eu vinha de uma região do norte da África e estava em Jerusalém na época da Páscoa.',
        'Quando os soldados saíam levando Jesus para fora da cidade, eles me encontraram pelo caminho.',
        'Fui obrigado a carregar a cruz de Jesus até o lugar chamado Gólgota.'
      ],
      options: ['Simão de Cirene', 'José de Arimateia', 'Simão o Zelote', 'Barrabás'],
      summary: 'No caminho da crucificação, carregou o madeiro de Cristo até o Gólgota, "Lugar da Caveira" (Mt 27:32).'
    },
    {
      id: 'c8',
      name: 'José de Arimateia',
      role: 'Discípulo Rico que Sepultou Jesus',
      ref: 'Mateus 27:57-60',
      clues: [
        'Eu era um homem rico e também discípulo de Jesus.',
        'Ao cair da tarde da sexta-feira da crucificação, fui corajosamente até Pilatos pedir o corpo de Jesus.',
        'Envolvi o corpo em um lençol limpo e o coloquei no meu próprio sepulcro novo, aberto na rocha.'
      ],
      options: ['José de Arimateia', 'Pilatos', 'Caifás', 'Jovem Rico'],
      summary: 'Honrou o corpo de Cristo com um túmulo novo, onde a pedra foi rolada antes da ressurreição (Mt 27:57-60).'
    },
    {
      id: 'c9',
      name: 'Rute',
      role: 'Moabita na Genealogia de Jesus',
      ref: 'Mateus 1:5',
      clues: [
        'Sou uma das cinco mulheres citadas explicitamente na genealogia de Jesus em Mateus 1.',
        'Eu era estrangeira, natural de Moabe, mas permaneci fiel ao Deus de Israel.',
        'Casei-me com Boaz, fui mãe de Obede e bisavó do rei Davi.'
      ],
      options: ['Rute', 'Tamar', 'Raabe', 'Bate-Seba'],
      summary: 'Estrangeira moabita acolhida pela fé e incluída na linhagem real do Messias (Mt 1:5).'
    },
    {
      id: 'c10',
      name: 'Raabe',
      role: 'Moradora de Jericó na Genealogia',
      ref: 'Mateus 1:5',
      clues: [
        'Eu apareço no primeiro bloco da genealogia de Mateus, no versículo 5.',
        'Eu era uma estrangeira da cidade de Jericó que acolheu os espias de Israel pela fé.',
        'Casei-me com Salmom e fui mãe de Boaz.'
      ],
      options: ['Raabe', 'Rute', 'Tamar', 'Maria Madalena'],
      summary: 'Acolhida pela fé em Jericó, tornou-se ancestral direta do Rei Davi e de Jesus Cristo (Mt 1:5).'
    },
    {
      id: 'c11',
      name: 'Magos do Oriente',
      role: 'Sábios Gentios Adoradores',
      ref: 'Mateus 2:1-12',
      clues: [
        'Observamos o surgimento de uma estrela especial no Oriente e viajamos até Jerusalém perguntando pelo Rei dos Judeus.',
        'Fomos a Belém, entramos na casa e nos prostramos diante do menino com Maria.',
        'Oferecemos ouro, incenso e mirra, e voltamos por outro caminho após um aviso divino em sonho.'
      ],
      options: ['Magos do Oriente', 'Pastores de Belém', 'Escribas do Templo', 'Guardas do Sepulcro'],
      summary: 'Representam os primeiros gentios adorando o Rei Messias logo em sua infância (Mt 2:1-12).'
    },
    {
      id: 'c12',
      name: 'Pôncio Pilatos',
      role: 'Governador Romano',
      ref: 'Mateus 27:1-26',
      clues: [
        'Eu era o governador romano diante de quem Jesus foi levado pela manhã no Pretório.',
        'Minha mulher mandou me avisar para não me envolver com aquele Justo, pois havia sofrido muito em sonho por causa dele.',
        'Soltei Barrabás para a multidão, lavei as mãos diante do povo e entreguei Jesus para ser crucificado.'
      ],
      options: ['Pôncio Pilatos', 'Herodes', 'Caifás', 'Centurião Romano'],
      summary: 'Reconheceu a inocência de Jesus, mas cedeu à pressão das lideranças e da multidão (Mt 27:24).'
    },
    {
      id: 'c13',
      name: 'Maria Madalena',
      role: 'Primeira Testemunha da Ressurreição',
      ref: 'Mateus 27:56, 61; 28:1-10',
      clues: [
        'Eu estava entre as mulheres que observavam de longe a crucificação e depois sentei-me defronte do sepulcro.',
        'No alvorecer do primeiro dia da semana, fui com a outra Maria ver o túmulo.',
        'Recebi do anjo a notícia da ressurreição e encontrei o próprio Jesus vivo pelo caminho.'
      ],
      options: ['Maria Madalena', 'Tamar', 'Mulher Cananeia', 'Bate-Seba'],
      summary: 'Permaneceu fiel até a cruz e ao túmulo, tornando-se testemunha da vitória de Cristo sobre a morte (Mt 28).'
    },
    {
      id: 'c14',
      name: 'Jovem Rico',
      role: 'Aquele que se Retirou Triste',
      ref: 'Mateus 19:16-22',
      clues: [
        'Aproximei-me de Jesus perguntando: "Bom Mestre, que bem farei para conseguir a vida eterna?".',
        'Afirmei guardar todos os mandamentos desde a minha mocidade.',
        'Quando Jesus pediu que eu vendesse meus bens, desse aos pobres e o seguisse, retirei-me triste porque possuía muitas propriedades.'
      ],
      options: ['Jovem Rico', 'Mateus', 'Zaqueu', 'Nicodemos'],
      summary: 'Ilustra em Mt 19 o perigo do apego às riquezas acima do chamado para seguir a Cristo.'
    },
    {
      id: 'c15',
      name: 'Herodes Antipas',
      role: 'Tetrarca da Galileia',
      ref: 'Mateus 14:1-12',
      clues: [
        'Eu era o tetrarca que ouviu falar da fama de Jesus e pensei que João Batista havia ressuscitado.',
        'Mandei prender João porque ele me dizia não ser lícito possuir a mulher de meu irmão Filipe.',
        'Durante a festa do meu aniversário, fiz um juramento imprudente diante dos convidados e mandei degolar João no cárcere.'
      ],
      options: ['Herodes Antipas', 'Pôncio Pilatos', 'Arquelau', 'Caifás'],
      summary: 'Tetrarca que cedeu ao orgulho e ao juramento precipitado, ordenando a morte de João Batista (Mt 14:1-12).'
    },
    {
      id: 'c16',
      name: 'Barrabás',
      role: 'Prisioneiro Famoso Solto na Páscoa',
      ref: 'Mateus 27:16-26',
      clues: [
        'Eu era um preso bastante conhecido em Jerusalém sob custódia romana.',
        'Na festa da Páscoa, o governador costumava soltar um prisioneiro escolhido pela multidão.',
        'Persuadida pelos principais sacerdotes e anciãos, a multidão pediu a minha liberdade em lugar de Jesus.'
      ],
      options: ['Barrabás', 'Simão de Cirene', 'Judas Iscariotes', 'Simão o Leproso'],
      summary: 'Foi posto em liberdade por Pilatos enquanto o Inocente Jesus foi entregue à cruz (Mt 27:26).'
    },
    {
      id: 'c17',
      name: 'Tamar',
      role: 'Primeira Mulher na Genealogia',
      ref: 'Mateus 1:3',
      clues: [
        'Sou a primeira das cinco mulheres mencionadas na genealogia de Jesus em Mateus 1.',
        'Fui cananeia e minha história está ligada ao quarto filho de Jacó.',
        'Por meio de mim nasceram os gêmeos Perez e Zerá, preservando a descendência de Judá.'
      ],
      options: ['Tamar', 'Raabe', 'Rute', 'Bate-Seba'],
      summary: 'Citada em Mt 1:3 no primeiro bloco da genealogia como parte da linhagem real de Judá.'
    },
    {
      id: 'c18',
      name: 'Simão, o Leproso',
      role: 'Anfitrião em Betânia',
      ref: 'Mateus 26:6-13',
      clues: [
        'Minha casa ficava na aldeia de Betânia, próxima a Jerusalém.',
        'Recebi Jesus à mesa pouco antes da Páscoa da Sua paixão.',
        'Foi em minha casa que uma mulher derramou um vaso de alabastro com perfume precioso sobre a cabeça de Jesus.'
      ],
      options: ['Simão, o Leproso', 'Simão Pedro', 'Simão de Cirene', 'José de Arimateia'],
      summary: 'Em sua casa em Betânia ocorreu a unção profética de Jesus para a sepultura (Mt 26:6-13).'
    }
  ];

  // =====================================================================
  // 3. ACERTE A PALAVRA NO TEMPO (Modo Vigília / Cronômetro Regressivo)
  // =====================================================================
  const WORD_CHALLENGES = [
    {
      word: 'EMANUEL',
      seconds: 22,
      ref: 'Mateus 1:23',
      clue: 'Nome profetizado por Isaías que significa "Deus conosco".'
    },
    {
      word: 'BELÉM',
      seconds: 18,
      ref: 'Mateus 2:1',
      clue: 'Cidade da Judeia onde Jesus nasceu nos dias do rei Herodes.'
    },
    {
      word: 'JORDÃO',
      seconds: 18,
      ref: 'Mateus 3:13',
      clue: 'Rio onde João Batista batizou Jesus.'
    },
    {
      word: 'CAFARNAUM',
      seconds: 25,
      ref: 'Mateus 4:13',
      clue: 'Cidade à beira do mar onde Jesus fixou base ministerial na Galileia.'
    },
    {
      word: 'ROCHA',
      seconds: 18,
      ref: 'Mateus 7:24',
      clue: 'Base firme sobre a qual o homem prudente edificou sua casa.'
    },
    {
      word: 'TEMPESTADE',
      seconds: 24,
      ref: 'Mateus 8:24-26',
      clue: 'Grande agitação no mar que Jesus acalmou repreendendo os ventos e as ondas.'
    },
    {
      word: 'COLETORIA',
      seconds: 24,
      ref: 'Mateus 9:9',
      clue: 'Local onde Mateus trabalhava recolhendo impostos quando foi chamado por Jesus.'
    },
    {
      word: 'SEMEADOR',
      seconds: 22,
      ref: 'Mateus 13:3',
      clue: 'Primeira grande parábola do Reino no capítulo 13 de Mateus.'
    },
    {
      word: 'PÉROLA',
      seconds: 20,
      ref: 'Mateus 13:45-46',
      clue: 'Joia de grande valor procurada pelo negociante na parábola do Reino.'
    },
    {
      word: 'MOISÉS',
      seconds: 18,
      ref: 'Mateus 17:3',
      clue: 'Profeta que apareceu ao lado de Elias na Transfiguração de Jesus.'
    },
    {
      word: 'CRIANÇA',
      seconds: 20,
      ref: 'Mateus 18:2-4',
      clue: 'Modelo de humildade que Jesus colocou no meio dos discípulos.'
    },
    {
      word: 'JUMENTO',
      seconds: 20,
      ref: 'Mateus 21:5-7',
      clue: 'Animal sobre o qual Jesus entrou humildemente em Jerusalém sob aclamações.'
    },
    {
      word: 'VIRGENS',
      seconds: 20,
      ref: 'Mateus 25:1',
      clue: 'Personagens da parábola sobre vigilância e azeite reserva para receber o noivo.'
    },
    {
      word: 'TALENTOS',
      seconds: 22,
      ref: 'Mateus 25:14-30',
      clue: 'Bens confiados aos servos que deveriam ser multiplicados com fidelidade.'
    },
    {
      word: 'GETSÊMANI',
      seconds: 25,
      ref: 'Mateus 26:36',
      clue: 'Jardim/lugar onde Jesus orou em agonia antes de ser preso.'
    },
    {
      word: 'GÓLGOTA',
      seconds: 22,
      ref: 'Mateus 27:33',
      clue: 'Lugar chamado "da Caveira", onde Jesus foi crucificado.'
    },
    {
      word: 'CIRENE',
      seconds: 20,
      ref: 'Mateus 27:32',
      clue: 'Cidade de origem de Simão, que levou a cruz de Jesus.'
    },
    {
      word: 'SALOMÃO',
      seconds: 22,
      ref: 'Mateus 1:6-7',
      clue: 'Filho de Davi que inicia o 2º bloco da genealogia real de Mateus.'
    },
    {
      word: 'ABRAÃO',
      seconds: 18,
      ref: 'Mateus 1:2',
      clue: 'Patriarca que dá início à genealogia de Jesus em Mateus 1.'
    },
    {
      word: 'MIRRA',
      seconds: 18,
      ref: 'Mateus 2:11',
      clue: 'Terceiro presente trazido pelos magos junto com ouro e incenso.'
    },
    {
      word: 'POMBA',
      seconds: 18,
      ref: 'Mateus 3:16',
      clue: 'Forma visível em que o Espírito de Deus desceu sobre Jesus no batismo.'
    },
    {
      word: 'PEIXE',
      seconds: 18,
      ref: 'Mateus 17:27',
      clue: 'Animal de cuja boca Pedro tirou uma moeda para pagar o imposto.'
    },
    {
      word: 'ARQUELAU',
      seconds: 24,
      ref: 'Mateus 2:22',
      clue: 'Filho que reinava na Judeia no lugar de Herodes, fazendo José seguir para a Galileia.'
    },
    {
      word: 'ESTÁTER',
      seconds: 22,
      ref: 'Mateus 17:27',
      clue: 'Moeda exata encontrada por Pedro na boca do peixe para pagar o imposto por ambos.'
    },
    {
      word: 'SADUCEUS',
      seconds: 24,
      ref: 'Mateus 22:23',
      clue: 'Grupo religioso que negava a ressurreição e interrogou Jesus no templo.'
    },
    {
      word: 'ALABASTRO',
      seconds: 25,
      ref: 'Mateus 26:7',
      clue: 'Material do vaso que continha o unguento precioso derramado sobre Jesus em Betânia.'
    },
    {
      word: 'BARRABÁS',
      seconds: 22,
      ref: 'Mateus 27:26',
      clue: 'Prisioneiro que Pilatos soltou para a multidão antes de entregar Jesus à cruz.'
    },
    {
      word: 'BETFAGÉ',
      seconds: 22,
      ref: 'Mateus 21:1',
      clue: 'Aldeia próxima ao Monte das Oliveiras de onde Jesus enviou dois discípulos buscar a jumenta.'
    }
  ];

  // =====================================================================
  // 4. LINHA DO TEMPO & JORNADA (Ordenar acontecimentos do Evangelho)
  // =====================================================================
  const TIMELINE_SETS = [
    {
      id: 't1',
      title: 'Infância e Preparação (Mateus 1 a 4)',
      ref: 'PDF Guia Completo - Pág. 5 e 12',
      items: [
        { id: 'a', text: 'Nascimento em Belém e adoração dos magos', ref: 'Mt 2:1-11' },
        { id: 'b', text: 'Fuga para o Egito e moradia em Nazaré', ref: 'Mt 2:13-23' },
        { id: 'c', text: 'Batismo no Rio Jordão por João Batista', ref: 'Mt 3:13-17' },
        { id: 'd', text: 'Vitória sobre as tentações no deserto', ref: 'Mt 4:1-11' }
      ]
    },
    {
      id: 't2',
      title: 'Roteiro Geográfico de Jesus (Etapas do Guia)',
      ref: 'PDF Guia Completo - Pág. 12',
      items: [
        { id: 'a', text: 'Infância: Belém -> Egito -> Nazaré', ref: 'Mt 2' },
        { id: 'b', text: 'Galileia: Cafarnaum -> Mar -> Genesaré', ref: 'Mt 4-15' },
        { id: 'c', text: 'Excursões: Tiro/Sidom -> Cesareia de Filipe', ref: 'Mt 15-17' },
        { id: 'd', text: 'Paixão e Envio: Jericó -> Oliveiras -> Gólgota -> Monte na Galileia', ref: 'Mt 19-28' }
      ]
    },
    {
      id: 't3',
      title: 'Os Cinco Grandes Discursos em Ordem',
      ref: 'PDF Guia Completo - Pág. 4',
      items: [
        { id: 'a', text: 'Sermão do Monte (Ética e justiça do Reino)', ref: 'Cap. 5-7' },
        { id: 'b', text: 'Envio dos Doze (Coragem missionária)', ref: 'Cap. 10' },
        { id: 'c', text: 'Parábolas do Reino (Semeador, pérola, tesouro)', ref: 'Cap. 13' },
        { id: 'd', text: 'Vida Comunitária (Humildade e perdão) e Discurso Profético', ref: 'Cap. 18 e 24-25' }
      ]
    },
    {
      id: 't4',
      title: 'A Genealogia em Três Blocos (Mt 1:1-17)',
      ref: 'PDF Genealogia - Pág. 3 a 6',
      items: [
        { id: 'a', text: '1º Bloco: De Abraão até o Rei Davi (Era dos Patriarcas)', ref: 'Mt 1:2-6a' },
        { id: 'b', text: '2º Bloco: De Salomão até Jeconias e o Exílio (Monarquia)', ref: 'Mt 1:6b-11' },
        { id: 'c', text: '3º Bloco: De Salatiel e Zorobabel até José, marido de Maria', ref: 'Mt 1:12-16' },
        { id: 'd', text: 'Nascimento de Jesus Cristo, chamado Emanuel', ref: 'Mt 1:16-25' }
      ]
    },
    {
      id: 't5',
      title: 'Semana da Paixão e Ressurreição (Mt 21 a 28)',
      ref: 'PDF História Completa - Pág. 12 a 16',
      items: [
        { id: 'a', text: 'Entrada triunfal em Jerusalém e purificação do templo', ref: 'Mt 21:1-17' },
        { id: 'b', text: 'Última Ceia e oração de entrega no Getsêmani', ref: 'Mt 26:26-46' },
        { id: 'c', text: 'Julgamento diante de Pilatos e crucificação no Gólgota', ref: 'Mt 27:11-50' },
        { id: 'd', text: 'Túmulo vazio e Grande Comissão no monte da Galileia', ref: 'Mt 28:1-20' }
      ]
    },
    {
      id: 't6',
      title: 'Ministério na Galileia e Milagres (Mt 8 a 17)',
      ref: 'PDF História Completa - Pág. 7 a 10',
      items: [
        { id: 'a', text: 'Cura do servo do centurião e chamado de Mateus na coletoria', ref: 'Mt 8-9' },
        { id: 'b', text: 'Multiplicação dos cinco pães e caminhada sobre o mar', ref: 'Mt 14:13-33' },
        { id: 'c', text: 'Confissão de Pedro em Cesareia de Filipe', ref: 'Mt 16:13-20' },
        { id: 'd', text: 'Transfiguração com Moisés e Elias diante de três discípulos', ref: 'Mt 17:1-8' }
      ]
    }
  ];

  // =====================================================================
  // 5. VERDADEIRO OU FALSO RELÂMPAGO (Modo Vigília / Fato ou Mito)
  // =====================================================================
  const TRUE_FALSE_QUESTIONS = [
    {
      statement: 'A genealogia de Jesus em Mateus começa em Adão e vai subindo até Jesus.',
      isTrue: false,
      ref: 'Mateus 1:1-2 / PDF Genealogia Pág. 9',
      explanation: 'Falso! Quem sobe de Jesus até Adão é Lucas 3. Mateus 1 vai em ordem descendente: de Abraão e Davi até Jesus Cristo.'
    },
    {
      statement: 'A soma numérica hebraica (gematria) das consoantes do nome "Davi" (D-V-D) é exatamente 14.',
      isTrue: true,
      ref: 'PDF Genealogia Pág. 3 / Mt 1:17',
      explanation: 'Verdadeiro! Dalet (4) + Vav (6) + Dalet (4) = 14, explicando a estrutura em 3 blocos de 14 gerações.'
    },
    {
      statement: 'O Evangelho de Mateus nomeia explicitamente o monte onde ocorreu o Sermão do Monte.',
      isTrue: false,
      ref: 'PDF História Pág. 6 / Guia Pág. 13',
      explanation: 'Falso! Os montes do Sermão, da Transfiguração e da Grande Comissão não são nomeados no texto de Mateus.'
    },
    {
      statement: 'As cinco mulheres citadas na genealogia de Mateus são Tamar, Raabe, Rute, Bate-Seba e Maria.',
      isTrue: true,
      ref: 'Mateus 1:3-16 / PDF Genealogia Pág. 7',
      explanation: 'Verdadeiro! Essas cinco mulheres mostram como a graça de Deus inclui estrangeiras e redime a história.'
    },
    {
      statement: 'Em Mateus 4, durante as três tentações no deserto, Jesus respondeu citando passagens do livro de Deuteronômio.',
      isTrue: true,
      ref: 'Mateus 4:4, 7, 10 / PDF História Pág. 5',
      explanation: 'Verdadeiro! "Está escrito..." — Jesus citou Deuteronômio 8:3, 6:16 e 6:13 para vencer o tentador.'
    },
    {
      statement: 'Na multiplicação dos pães em Mateus, Jesus alimentou apenas 5.000 pessoas uma única vez.',
      isTrue: false,
      ref: 'Mateus 14:13-21 e 15:32-39',
      explanation: 'Falso! Além de alimentar 5.000 homens em Mt 14, Jesus também alimentou 4.000 homens (com sete pães) em Mt 15.'
    },
    {
      statement: 'Pedro, Tiago e João foram os três discípulos que presenciaram a Transfiguração com Moisés e Elias.',
      isTrue: true,
      ref: 'Mateus 17:1-8',
      explanation: 'Verdadeiro! Jesus levou consigo Pedro, Tiago e João a um alto monte e transfigurou-se diante deles.'
    },
    {
      statement: 'No versículo 16 de Mateus 1, o texto diz "José gerou a Jesus", mantendo o mesmo verbo anterior.',
      isTrue: false,
      ref: 'Mateus 1:16 / PDF Genealogia Pág. 8',
      explanation: 'Falso! Há uma ruptura proposital do padrão: José não gera Jesus; o texto diz "José, marido de Maria, da qual nasceu Jesus".'
    },
    {
      statement: 'Ao retornar do Egito, José evitou a Judeia e foi para Nazaré porque Arquelau reinava em lugar de seu pai Herodes.',
      isTrue: true,
      ref: 'Mateus 2:22-23',
      explanation: 'Verdadeiro! Temendo Arquelau e avisado em sonho, José retirou-se para as regiões da Galileia e habitou em Nazaré.'
    },
    {
      statement: 'Na parábola das Sete Parábolas do Reino (Mt 13), Jesus explicou a parábola do Tesouro Escondido à multidão na praia.',
      isTrue: false,
      ref: 'Mateus 13:36-44',
      explanation: 'Falso! Depois de despedir a multidão e entrar em casa, Jesus contou o Tesouro Escondido, a Pérola e a Rede apenas aos discípulos.'
    },
    {
      statement: 'Em Mateus 18, o servo impiedoso teve uma dívida de dez mil talentos perdoada pelo rei, mas cobrou cem dinheiros do conservo.',
      isTrue: true,
      ref: 'Mateus 18:24-28',
      explanation: 'Verdadeiro! O contraste entre dez mil talentos e cem denários mostra quão absurda é a falta de perdão entre irmãos.'
    },
    {
      statement: 'Na parábola dos trabalhadores da vinha (Mt 20), os que trabalharam apenas uma hora receberam metade de um denário.',
      isTrue: false,
      ref: 'Mateus 20:9-10',
      explanation: 'Falso! Todos receberam um dinheiro (denário) inteiro, revelando a generosidade da graça divina.'
    },
    {
      statement: 'Os saduceus negavam a ressurreição e perguntaram a Jesus sobre uma mulher que se casou com sete irmãos.',
      isTrue: true,
      ref: 'Mateus 22:23-28',
      explanation: 'Verdadeiro! Jesus respondeu aos saduceus citando Êxodo 3:6 e afirmando que Deus não é Deus de mortos, mas de vivos.'
    },
    {
      statement: 'Em Mateus 23:23, Jesus elogiou os fariseus por darem o dízimo de hortelã, endro e cominho, mesmo que desprezassem a misericórdia.',
      isTrue: false,
      ref: 'Mateus 23:23',
      explanation: 'Falso! Jesus os repreendeu ("Ai de vós!"), ensinando que deviam praticar o juízo, a misericórdia e a fé, sem omitir aquelas coisas.'
    },
    {
      statement: 'Na casa de Simão, o leproso, em Betânia, uma mulher ungiu a cabeça de Jesus com um vaso de alabastro.',
      isTrue: true,
      ref: 'Mateus 26:6-7',
      explanation: 'Verdadeiro! Os discípulos se indignaram com o suposto desperdício, mas Jesus defendeu-a dizendo que preparava seu corpo para a sepultura.'
    },
    {
      statement: 'Ao chegar ao Gólgota, Jesus bebeu com alegria todo o vinho misturado com fel que lhe ofereceram.',
      isTrue: false,
      ref: 'Mateus 27:34',
      explanation: 'Falso! Mateus 27:34 registra que, depois de prová-lo, Jesus não o quis beber.'
    },
    {
      statement: 'Os sacerdotes e anciãos subornaram os guardas do sepulcro para dizerem que os discípulos roubaram o corpo de Jesus.',
      isTrue: true,
      ref: 'Mateus 28:11-15',
      explanation: 'Verdadeiro! Mesmo diante do milagre da ressurreição, deram muito dinheiro aos soldados para espalhar essa versão.'
    },
    {
      statement: 'Na parábola dos Talentos (Mt 25), o servo que recebeu apenas um talento foi elogiado por enterrá-lo na terra com segurança.',
      isTrue: false,
      ref: 'Mateus 25:24-30',
      explanation: 'Falso! Ele foi repreendido como servo mau e negligente; a parábola ensina fidelidade ativa multiplicando os dons.'
    },
    {
      statement: 'Jesus encerra Mateus dizendo que toda autoridade no céu e na terra lhe foi dada e envia os discípulos a todas as nações.',
      isTrue: true,
      ref: 'Mateus 28:18-20',
      explanation: 'Verdadeiro! A Grande Comissão abre a missão universal acompanhada da promessa de Sua presença constante.'
    },
    {
      statement: 'Na entrada triunfal em Jerusalém (Mt 21), Jesus entrou montado num cavalo branco de guerra.',
      isTrue: false,
      ref: 'Mateus 21:5-7',
      explanation: 'Falso! Cumprindo Zacarias 9:9, o Rei manso entrou montado num jumento (jumentinha e jumentinho), sob aclamações de "Hosana".'
    },
    {
      statement: 'Na noite em que Jesus foi preso no Getsêmani, Judas o entregou através de um beijo.',
      isTrue: true,
      ref: 'Mateus 26:47-49',
      explanation: 'Verdadeiro! Judas havia combinado o sinal: "Aquele que eu beijar, esse é; prendei-o".'
    },
    {
      statement: 'Em Mateus 25:31-46 (Juízo das Nações), servir famintos, enfermos e presos equivale a servir ao próprio Rei Cristo.',
      isTrue: true,
      ref: 'Mateus 25:40 / PDF História Pág. 13',
      explanation: 'Verdadeiro! "Quando o fizestes a um destes meus pequeninos irmãos, a mim o fizestes."'
    },
    {
      statement: 'O Evangelho de Mateus possui 24 capítulos ao todo.',
      isTrue: false,
      ref: 'PDF Guia Completo Pág. 1',
      explanation: 'Falso! O Evangelho de Mateus tem 28 capítulos completos, do nascimento e genealogia à ressurreição e Grande Comissão.'
    }
  ];

  // =====================================================================
  // 6. CONTEÚDO DE ESTUDO, CURIOSIDADES E RASTREADOR DOS 28 CAPÍTULOS
  // =====================================================================
  const STUDY_DATA = {
    overview: {
      author: 'Levi Mateus (cobrador de impostos chamado por Jesus)',
      date: '80 a 90 d.C. (estimada)',
      audience: 'Comunidades mistas de forte raiz judaica',
      purpose: 'Apresentar Jesus como o Messias Filho de Davi e Filho de Abraão, cumprimento fiel das Escrituras',
      centralAxis: 'O Reino dos Céus inaugurado por ensino, cura e misericórdia'
    },
    fiveDiscourses: [
      {
        chapters: 'Capítulos 5–7',
        title: 'Sermão do Monte',
        summary: 'Ética e justiça do Reino: Bem-aventuranças, sal e luz, Pai-Nosso, amor aos inimigos, regra de ouro e casa na rocha.'
      },
      {
        chapters: 'Capítulo 10',
        title: 'Envio dos Doze',
        summary: 'Comissionamento dos doze apóstolos com poder para curar, pregar a Israel e coragem diante de perseguições.'
      },
      {
        chapters: 'Capítulo 13',
        title: 'Parábolas do Reino',
        summary: 'Sete parábolas sobre crescimento e valor incomparável do Reino: semeador, joio e trigo, grão de mostarda, fermento, tesouro escondido, pérola e rede.'
      },
      {
        chapters: 'Capítulo 18',
        title: 'Vida Comunitária',
        summary: 'Humildade exemplar das crianças, cuidado com os pequenos, busca pela ovelha perdida e perdão ilimitado (servo impiedoso).'
      },
      {
        chapters: 'Capítulos 24–25',
        title: 'Discurso Profético',
        summary: 'Sinais no Monte das Oliveiras, vigilância constante sem marcar datas, Dez Virgens, Talentos e o Juízo das Nações.'
      }
    ],
    genealogy: {
      blocks: [
        {
          number: '14',
          title: '1º Bloco: De Abraão a Davi',
          era: 'Era dos Patriarcas (Mt 1:2–6a)',
          names: 'Abraão -> Isaque -> Jacó -> Judá -> Perez -> Esrom -> Arão -> Aminadabe -> Naassom -> Salmom -> Boaz -> Obede -> Jessé -> Rei Davi',
          note: 'A tribo de Judá recebe a promessa do cetro real até a vinda do Messias.'
        },
        {
          number: '14',
          title: '2º Bloco: De Davi ao Exílio',
          era: 'Era da Monarquia (Mt 1:6b–11)',
          names: 'Salomão -> Roboão -> Abias -> Asa -> Josafá -> Jorão -> Uzias -> Jotão -> Acaz -> Ezequias -> Manassés -> Amom -> Josias -> Jeconias',
          note: 'Inclui reis fiéis e infiéis até a queda de Jerusalém e a deportação babilônica.'
        },
        {
          number: '14',
          title: '3º Bloco: Do Exílio até o Cristo',
          era: 'Era Pós-Exílica (Mt 1:12–16)',
          names: 'Salatiel -> Zorobabel -> Abiúde -> Eliaquim -> Azor -> Sadoque -> Aquim -> Eliúde -> Eleazar -> Matã -> Jacó -> José -> Maria -> Jesus Cristo',
          note: 'Período silencioso que preserva a linhagem fora do trono, culminando no nascimento virginal.'
        }
      ],
      women: [
        { name: 'Tamar', ref: 'Mateus 1:3', desc: 'Cananeia que preservou a descendência de Judá.' },
        { name: 'Raabe', ref: 'Mateus 1:5', desc: 'Estrangeira de Jericó acolhida pela fé.' },
        { name: 'Rute', ref: 'Mateus 1:5', desc: 'Moabita fiel, esposa de Boaz e bisavó do rei Davi.' },
        { name: 'Mulher de Urias (Bate-Seba)', ref: 'Mateus 1:6', desc: 'Lembra a falha de Davi e a graça redentora de Deus.' },
        { name: 'Maria', ref: 'Mateus 1:16', desc: 'A virgem escolhida pela ação do Espírito Santo.' }
      ],
      comparison: [
        { criterion: 'Direção', matthew: 'Descendente (Abraão até Jesus)', luke: 'Ascendente (Jesus até Adão)' },
        { criterion: 'Ponto de Partida', matthew: 'Abraão (Pai da nação judaica)', luke: 'Adão e Deus (Toda a humanidade)' },
        { criterion: 'Filho de Davi', matthew: 'Salomão (Linhagem real legal)', luke: 'Natã (Linhagem biológica)' },
        { criterion: 'Ênfase Central', matthew: 'Jesus como Rei Messias de Israel', luke: 'Jesus como Salvador universal' }
      ]
    },
    geography: {
      stages: [
        { step: '1. Infância (Mt 2)', route: 'Belém -> Egito -> Nazaré', detail: 'Nascimento, adoração dos magos, fuga de Herodes e infância.' },
        { step: '2. Início (Mt 3–4)', route: 'Jordão -> Deserto -> Cafarnaum', detail: 'Batismo trinitário, vitória nas tentações e base ministerial.' },
        { step: '3. Galileia (Mt 4–15)', route: 'Cafarnaum -> Mar -> Genesaré', detail: 'Sermão do Monte, curas, multiplicação de pães e parábolas.' },
        { step: '4. Excursões (Mt 15–17)', route: 'Tiro/Sidom -> Cesareia de Filipe', detail: 'Fé da cananeia, confissão de Pedro e Transfiguração.' },
        { step: '5. Paixão (Mt 19–27)', route: 'Jericó -> Oliveiras -> Gólgota', detail: 'Cura dos dois cegos, Última Ceia, Getsêmani, cruz e túmulo.' },
        { step: '6. Envio (Mt 28)', route: 'Túmulo -> Monte na Galileia', detail: 'Encontro com o Ressuscitado e Grande Comissão às nações.' }
      ]
    },
    curiosities: [
      {
        title: 'O Segredo do Número 14 (Gematria de Davi)',
        ref: 'Mateus 1:17',
        icon: 'crown',
        text: 'No hebraico antigo, as letras tinham valores numéricos. As três consoantes do nome "Davi" (D-V-D: Dalet=4, Vav=6, Dalet=4) somam exatamente 14! Por isso Mateus organizou a genealogia em 3 séries de 14 gerações.'
      },
      {
        title: 'A Única Troca de Verbo no Capítulo 1',
        ref: 'Mateus 1:16',
        icon: 'scroll',
        text: 'Por 39 vezes seguidas Mateus repete o verbo "gerou". Mas ao chegar a José, muda cuidadosamente para: "José, marido de Maria, da qual nasceu Jesus". Assim afirma tanto o direito real legal por José quanto a concepção virginal pelo Espírito.'
      },
      {
        title: 'Montes Sem Nome no Texto',
        ref: 'Mt 5, 17 e 28',
        icon: 'compass',
        text: 'Embora a tradição associe nomes a vários lugares, o próprio texto do Evangelho de Mateus não nomeia o monte do Sermão (Mt 5), nem o monte da Transfiguração (Mt 17), nem o monte da Grande Comissão (Mt 28).'
      },
      {
        title: 'Do Chamado na Coletoria à Pena do Evangelho',
        ref: 'Mateus 9:9',
        icon: 'book-open',
        text: 'Mateus era cobrador de impostos (publicano), acostumado a lidar com registros escritos e números. Ao responder imediatamente ao "Segue-me" de Cristo, colocou sua vocação a serviço do Reino.'
      },
      {
        title: 'Reino dos Céus vs Reino de Deus',
        ref: 'Todo o Evangelho',
        icon: 'book',
        text: 'Por escrever a leitores de forte raiz judaica que evitavam pronunciar o nome sagrado de Deus sem necessidade, Mateus usa com frequência a expressão "Reino dos Céus" (mais de 30 vezes).'
      },
      {
        title: 'A Saudação "A Paz de Deus" e Nossa Comum',
        ref: 'Comunidade CCB',
        icon: 'church',
        text: 'Ao entrarmos em nossa Comum Congregação — retratada nas fotos ao entardecer e na noite serena ao fundo deste portal — nos saudamos com "A Paz de Deus". Em Mateus, Jesus também instrui os discípulos a saudarem as casas desejando-lhes a paz (Mt 10:12-13).'
      }
    ],
    chapters: [
      { ch: 1, title: 'Genealogia e Nascimento de Jesus', summary: 'Três blocos de 14 gerações; José, Maria e Emanuel.' },
      { ch: 2, title: 'Visita dos Magos e Fuga', summary: 'Estrela em Belém, ouro/incenso/mirra, Egito e Nazaré.' },
      { ch: 3, title: 'João Batista e o Batismo', summary: 'Pregação no deserto e confirmação trinitária no Jordão.' },
      { ch: 4, title: 'Tentação e Início na Galileia', summary: '40 dias no deserto, Cafarnaum e primeiros discípulos.' },
      { ch: 5, title: 'Sermão do Monte I', summary: 'Bem-aventuranças, sal e luz, justiça interior e amor.' },
      { ch: 6, title: 'Sermão do Monte II', summary: 'Esmola, oração do Pai-Nosso, jejum e buscar o Reino.' },
      { ch: 7, title: 'Sermão do Monte III', summary: 'Regra de ouro, porta estreita e casa sobre a rocha.' },
      { ch: 8, title: 'Milagres de Autoridade', summary: 'Leproso, centurião, tempestade acalmada e gadarenos.' },
      { ch: 9, title: 'Perdão e Chamado de Mateus', summary: 'Paralítico, filha de Jairo e Mateus na coletoria.' },
      { ch: 10, title: 'Envio dos Doze Apóstolos', summary: 'Instruções missionárias, paz às casas e coragem.' },
      { ch: 11, title: 'Dúvida de João e Descanso', summary: 'Mensageiros de João, cidades incrédulas e jugo suave.' },
      { ch: 12, title: 'Senhor do Sábado', summary: 'Misericórdia, refutação a Belzebu e o sinal de Jonas.' },
      { ch: 13, title: 'Sete Parábolas do Reino', summary: 'Semeador, trigo e joio, mostarda, tesouro e pérola.' },
      { ch: 14, title: 'Pães, Peixes e Mar', summary: 'Morte de João, 5.000 alimentados e Jesus anda no mar.' },
      { ch: 15, title: 'Pureza e Mulher Cananeia', summary: 'Fé em Tiro e Sidom e multiplicação para 4.000.' },
      { ch: 16, title: 'Confissão de Pedro', summary: 'Cesareia de Filipe, anúncio da cruz e tomar a cruz.' },
      { ch: 17, title: 'Transfiguração e Moeda no Peixe', summary: 'Moisés e Elias no monte, cura e imposto pago.' },
      { ch: 18, title: 'Vida Comunitária', summary: 'Criança, ovelha perdida e perdão setenta vezes sete.' },
      { ch: 19, title: 'Valores e Jovem Rico', summary: 'Fidelidade, crianças abençoadas e apego às riquezas.' },
      { ch: 20, title: 'Vinha, Serviço e Cegos', summary: 'Trabalhadores da vinha, liderar servindo e cura em Jericó.' },
      { ch: 21, title: 'Entrada Triunfal e Templo', summary: 'Jumento, aclamações, templo purificado e figueira.' },
      { ch: 22, title: 'Debates e Maior Mandamento', summary: 'Tributo a César, ressurreição e amar a Deus e ao próximo.' },
      { ch: 23, title: 'Alerta Contra a Hipocrisia', summary: 'Crítica à aparência vazia e lamento por Jerusalém.' },
      { ch: 24, title: 'Sinais e Vigilância', summary: 'Discurso no Monte das Oliveiras: vigiai sem marcar datas.' },
      { ch: 25, title: 'Vigília, Dons e Juízo', summary: 'Dez Virgens, Talentos e o Juízo das Nações.' },
      { ch: 26, title: 'Unção, Ceia e Getsêmani', summary: 'Betânia, Nova Aliança, 30 moedas, oração e negação.' },
      { ch: 27, title: 'Julgamento, Cruz e Túmulo', summary: 'Pilatos, Simão de Cirene, véu rasgado e José de Arimateia.' },
      { ch: 28, title: 'Ressurreição e Grande Comissão', summary: 'Anjo no túmulo vazio e "Ide por todas as nações".' }
    ]
  };

  global.MateusData = {
    CHURCH_BACKGROUNDS,
    QUIZ_QUESTIONS,
    CHARACTERS_GAME,
    WORD_CHALLENGES,
    TIMELINE_SETS,
    TRUE_FALSE_QUESTIONS,
    STUDY_DATA
  };
})(window);
