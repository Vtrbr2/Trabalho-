// cookiesjsvisitetracker.js
// Módulo central que inicializa Firebase e exporta funções úteis.
// usa Firebase modular (v9+)

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase, ref, set, get, update,
  runTransaction
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

/* ====== COLOQUE AQUI SUA CONFIG DO FIREBASE (já predefinida pra você) ====== */
const firebaseConfig = {
  apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
  authDomain: "avaliacoes-20599.firebaseapp.com",
  databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/",
  projectId: "avaliacoes-20599",
  storageBucket: "avaliacoes-20599.appspot.com",
  messagingSenderId: "1003621715829",
  appId: "1:1003621715829:web:eb82bed77a69e570324d3c"
};
/* =========================================================================== */

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* Gera um id forte o suficiente para rastrear visitantes */
export function generateVisitorId() {
  // usa crypto se disponível
  try {
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    return 'v_' + Array.from(arr).map(n => n.toString(36).padStart(2,'0')).join('') + '_' + Date.now().toString(36);
  } catch (e) {
    return 'v_' + Math.random().toString(36).slice(2,10) + Date.now().toString(36);
  }
}

/* Cria nó do visitante se não existir (quando aceitar cookies) */
export async function createVisitor(visitorId) {
  const nodeRef = ref(db, `visitors/${visitorId}`);
  // escrita inicial
  try {
    await set(nodeRef, {
      acceptedAt: Date.now(),
      lastVisit: Date.now(),
      totalTime: 0
    });
  } catch (err) {
    console.error('createVisitor error', err);
    throw err;
  }
}

/* Garante que exista (se já existir não sobrescreve) */
export async function ensureVisitor(visitorId) {
  const nodeRef = ref(db, `visitors/${visitorId}`);
  try {
    const snapshot = await get(nodeRef);
    if (!snapshot.exists()) {
      await set(nodeRef, {
        acceptedAt: Date.now(),
        lastVisit: Date.now(),
        totalTime: 0
      });
    } else {
      // atualiza lastVisit
      await update(nodeRef, { lastVisit: Date.now() });
    }
  } catch (err) {
    console.error('ensureVisitor error', err);
  }
}

/* Atualiza tempo com transação (seguro para múltiplos tabs) */
export async function addVisitSeconds(visitorId, secondsToAdd) {
  if (!visitorId || secondsToAdd <= 0) return;
  const nodeRef = ref(db, `visitors/${visitorId}`);
  try {
    await runTransaction(nodeRef, (current) => {
      if (current === null) {
        return {
          acceptedAt: Date.now(),
          lastVisit: Date.now(),
          totalTime: secondsToAdd
        };
      }
      current.lastVisit = Date.now();
      current.totalTime = (current.totalTime || 0) + secondsToAdd;
      return current;
    }, { applyLocally: false });
  } catch (err) {
    console.error('addVisitSeconds error', err);
  }
}

/* Ler todos visitantes (útil para painel) */
export async function getAllVisitors() {
  const nodeRef = ref(db, 'visitors');
  try {
    const snap = await get(nodeRef);
    return snap.exists() ? snap.val() : {};
  } catch (err) {
    console.error('getAllVisitors error', err);
    return {};
  }
}
