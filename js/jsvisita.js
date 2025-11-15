// jsvisita.js
import {
  generateVisitorId,
  createVisitor,
  ensureVisitor,
  addVisitSeconds
} from './cookiesjsvisitetracker.js';

const BANNER = document.getElementById('cookie-banner');
const BTN_ACCEPT = document.getElementById('cookieAccept') || document.getElementById('cookieAccept');
const BTN_DECLINE = document.getElementById('cookieDecline') || document.getElementById('cookieDecline');

const LS_KEY = 'visitorId_jk';
let visitorId = localStorage.getItem(LS_KEY);

// Mostrar banner se visitante nunca aceitou
function showBanner() {
  if (!BANNER) return;
  BANNER.style.display = 'block';
}

// Esconder banner
function hideBanner() {
  if (!BANNER) return;
  BANNER.style.display = 'none';
}

async function acceptFlow() {
  // gera id, salva local e cria nó no banco
  visitorId = generateVisitorId();
  localStorage.setItem(LS_KEY, visitorId);
  await createVisitor(visitorId);
  hideBanner();
  startTracking();
}

function declineFlow() {
  // não salvamos id e não rastreamos (respeita privacidade)
  hideBanner();
  visitorId = null;
  localStorage.removeItem(LS_KEY);
}

/* TRACKING: medimos tempo em segundos apenas se visitorId existir */
let visibleStart = null;
let accumulated = 0;

// iniciar tracking: garante nó e começa a contar
async function startTracking() {
  if (!visitorId) return;
  await ensureVisitor(visitorId);
  visibleStart = Date.now();
  accumulated = 0;
}

// pause/resume em visibilitychange
document.addEventListener('visibilitychange', () => {
  if (!visitorId) return;
  if (document.visibilityState === 'hidden') {
    if (visibleStart) {
      const delta = Math.floor((Date.now() - visibleStart) / 1000);
      accumulated += delta;
      // atualiza imediato para não perder
      addVisitSeconds(visitorId, delta).catch(console.error);
      visibleStart = null;
    }
  } else {
    // voltou
    visibleStart = Date.now();
  }
});

// antes de sair da página
window.addEventListener('beforeunload', (e) => {
  if (!visitorId) return;
  if (visibleStart) {
    const delta = Math.floor((Date.now() - visibleStart) / 1000);
    accumulated += delta;
    // Use navigator.sendBeacon não é compatível com Realtime DB REST easily,
    // então fazemos update síncrono com runTransaction (pode demorar)
    // mas chamar a promise aqui pode não completar; ainda assim tentamos.
    addVisitSeconds(visitorId, delta).catch(console.error);
  }
});

// if user already accepted, start tracking immediately
if (visitorId) {
  // start in background
  startTracking();
} else {
  // show banner to accept
  showBanner();
}

// listeners nos botões (assegura existências)
const acceptBtn = document.getElementById('cookieAccept');
const declineBtn = document.getElementById('cookieDecline');

if (acceptBtn) acceptBtn.addEventListener('click', acceptFlow);
if (declineBtn) declineBtn.addEventListener('click', declineFlow);

/* === fim do arquivo === */
