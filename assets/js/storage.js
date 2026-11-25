/**
 * Persistencia Multi-Camada em Cache do Navegador (Mateus CCB)
 * Salva e recupera automaticamente o progresso de leitura e pontuacao usando:
 * 1) localStorage
 * 2) IndexedDB (banco local persistente do navegador)
 * 3) Cache Storage API (quando disponivel em http/https/localhost)
 * 4) Cookie persistente de 1 ano (quando disponivel em http/https/localhost)
 */
(function (global) {
  'use strict';

  const STORAGE_KEY = 'mateus_ccb_state_v2';
  const LEGACY_KEYS = {
    score: 'mateus_ccb_score',
    bestStreak: 'mateus_ccb_best_streak',
    readChapters: 'mateus_ccb_read_chapters',
    sound: 'mateus_ccb_sound'
  };
  const IDB_NAME = 'MateusCCB_CacheDB';
  const IDB_STORE = 'progress';
  const CACHE_NAME = 'mateus-ccb-progress-v1';
  const CACHE_URL = '/mateus-ccb-progress.json';
  const COOKIE_NAME = 'mateus_ccb_progress';

  function defaultData() {
    return {
      score: 0,
      bestStreak: 0,
      readChapters: [],
      sound: true,
      updatedAt: 0
    };
  }

  function sanitize(raw) {
    const base = defaultData();
    if (!raw || typeof raw !== 'object') return base;
    const chapters = Array.isArray(raw.readChapters)
      ? Array.from(new Set(raw.readChapters.map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 28))).sort((a, b) => a - b)
      : [];
    return {
      score: Math.max(0, Number(raw.score) || 0),
      bestStreak: Math.max(0, Number(raw.bestStreak) || 0),
      readChapters: chapters,
      sound: raw.sound !== false,
      updatedAt: Number(raw.updatedAt) || 0
    };
  }

  function mergeData(a, b) {
    const ca = sanitize(a);
    const cb = sanitize(b);
    const unionChapters = Array.from(new Set([...ca.readChapters, ...cb.readChapters])).sort((x, y) => x - y);
    const newer = cb.updatedAt > ca.updatedAt ? cb : ca;
    return {
      score: Math.max(ca.score, cb.score),
      bestStreak: Math.max(ca.bestStreak, cb.bestStreak),
      readChapters: unionChapters,
      sound: newer.sound,
      updatedAt: Math.max(ca.updatedAt, cb.updatedAt)
    };
  }

  function readCookie() {
    try {
      const pairs = document.cookie ? document.cookie.split('; ') : [];
      for (const p of pairs) {
        const idx = p.indexOf('=');
        if (idx === -1) continue;
        if (p.slice(0, idx) === COOKIE_NAME) {
          return JSON.parse(decodeURIComponent(p.slice(idx + 1)));
        }
      }
    } catch (_) {}
    return null;
  }

  function writeCookie(data) {
    try {
      const encoded = encodeURIComponent(JSON.stringify(data));
      if (encoded.length < 3800) {
        document.cookie = `${COOKIE_NAME}=${encoded}; max-age=31536000; path=/; SameSite=Lax`;
      }
    } catch (_) {}
  }

  function readLocalSync() {
    let data = defaultData();
    try {
      const v2 = localStorage.getItem(STORAGE_KEY);
      if (v2) {
        data = mergeData(data, JSON.parse(v2));
      }
      // Migra chaves antigas caso existam
      const legacyScore = Number(localStorage.getItem(LEGACY_KEYS.score) || 0);
      const legacyStreak = Number(localStorage.getItem(LEGACY_KEYS.bestStreak) || 0);
      const legacyChapters = JSON.parse(localStorage.getItem(LEGACY_KEYS.readChapters) || '[]');
      const legacySound = localStorage.getItem(LEGACY_KEYS.sound);
      if (legacyScore || legacyStreak || (Array.isArray(legacyChapters) && legacyChapters.length)) {
        data = mergeData(data, {
          score: legacyScore,
          bestStreak: legacyStreak,
          readChapters: legacyChapters,
          sound: legacySound !== 'false',
          updatedAt: Date.now()
        });
      }
    } catch (_) {}

    const fromCookie = readCookie();
    if (fromCookie) {
      data = mergeData(data, fromCookie);
    }
    return sanitize(data);
  }

  function writeLocalSync(data) {
    const clean = sanitize(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      localStorage.setItem(LEGACY_KEYS.score, String(clean.score));
      localStorage.setItem(LEGACY_KEYS.bestStreak, String(clean.bestStreak));
      localStorage.setItem(LEGACY_KEYS.readChapters, JSON.stringify(clean.readChapters));
      localStorage.setItem(LEGACY_KEYS.sound, String(clean.sound));
    } catch (_) {}
    writeCookie(clean);
  }

  function openIDB() {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        reject(new Error('No IndexedDB'));
        return;
      }
      const req = global.indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function readIDB() {
    try {
      const db = await openIDB();
      return await new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const store = tx.objectStore(IDB_STORE);
        const getReq = store.get('snapshot');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      });
    } catch (_) {
      return null;
    }
  }

  async function writeIDB(data) {
    try {
      const db = await openIDB();
      await new Promise((resolve) => {
        const tx = db.transaction(IDB_STORE, 'readwrite');
        tx.objectStore(IDB_STORE).put(sanitize(data), 'snapshot');
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      });
    } catch (_) {}
  }

  async function readCacheAPI() {
    try {
      if (!('caches' in global)) return null;
      const cache = await global.caches.open(CACHE_NAME);
      const res = await cache.match(CACHE_URL);
      if (!res) return null;
      return await res.json();
    } catch (_) {
      return null;
    }
  }

  async function writeCacheAPI(data) {
    try {
      if (!('caches' in global)) return;
      const cache = await global.caches.open(CACHE_NAME);
      const res = new Response(JSON.stringify(sanitize(data)), {
        headers: { 'Content-Type': 'application/json; charset=utf-8' }
      });
      await cache.put(CACHE_URL, res);
    } catch (_) {}
  }

  function save(partial) {
    const current = readLocalSync();
    const next = sanitize({
      ...current,
      ...partial,
      updatedAt: Date.now()
    });
    writeLocalSync(next);
    writeIDB(next);
    writeCacheAPI(next);
    return next;
  }

  function replace(fullData) {
    const clean = sanitize({ ...fullData, updatedAt: Date.now() });
    writeLocalSync(clean);
    writeIDB(clean);
    writeCacheAPI(clean);
    return clean;
  }

  async function hydrateAsync() {
    const syncData = readLocalSync();
    const [idbData, cacheData] = await Promise.all([readIDB(), readCacheAPI()]);
    let merged = syncData;
    if (idbData) merged = mergeData(merged, idbData);
    if (cacheData) merged = mergeData(merged, cacheData);

    // Sincroniza de volta para todas as camadas caso alguma estivesse vazia
    writeLocalSync(merged);
    await Promise.all([writeIDB(merged), writeCacheAPI(merged)]);
    return merged;
  }

  function exportCode(data) {
    const clean = sanitize(data || readLocalSync());
    const payload = JSON.stringify({
      s: clean.score,
      b: clean.bestStreak,
      c: clean.readChapters,
      u: clean.sound ? 1 : 0
    });
    return 'MTCCB-' + btoa(unescape(encodeURIComponent(payload)));
  }

  function importCode(code) {
    const trimmed = String(code || '').trim();
    if (!trimmed.startsWith('MTCCB-')) {
      throw new Error('Código inválido. Deve começar com MTCCB-.');
    }
    const rawJson = decodeURIComponent(escape(atob(trimmed.slice(6))));
    const parsed = JSON.parse(rawJson);
    const imported = sanitize({
      score: parsed.s,
      bestStreak: parsed.b,
      readChapters: parsed.c,
      sound: parsed.u !== 0,
      updatedAt: Date.now()
    });
    return replace(imported);
  }

  global.ProgressCache = {
    loadSync: readLocalSync,
    hydrateAsync,
    save,
    replace,
    exportCode,
    importCode
  };
})(window);
