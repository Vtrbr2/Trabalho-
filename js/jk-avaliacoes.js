// js/jk-avaliacoes.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
  authDomain: "avaliacoes-20599.firebaseapp.com",
  databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/",
  projectId: "avaliacoes-20599",
  storageBucket: "avaliacoes-20599.firebasestorage.app",
  messagingSenderId: "1003621715829",
  appId: "1:1003621715829:web:eb82bed77a69e570324d3c"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const refAvaliacoes = ref(db, "avaliacoes");

// ======= Carregar avaliações =======
const container = document.getElementById("avaliacoesCarousel");

onValue(refAvaliacoes, (snapshot) => {
  container.innerHTML = "";
  snapshot.forEach((child) => {
    const dados = child.val();
    const card = document.createElement("div");
    card.classList.add("avaliacao-card");

    card.innerHTML = `
      <div class="avaliacao-estrelas">${"★".repeat(dados.estrelas)}</div>
      <h4>${dados.nome || "Anônimo"}</h4>
      <p>${dados.comentario}</p>
    `;
    container.appendChild(card);
  });

  // Reiniciar o carrossel
  if (window.__jk_carousel_reinit) window.__jk_carousel_reinit();
});

// ======= Enviar avaliação =======
const starsInput = document.getElementById("starsInput");
const comentarioInput = document.getElementById("comentarioInput");
const enviarBtn = document.getElementById("enviarAvaliacao");

let estrelasSelecionadas = 0;

starsInput.querySelectorAll("i").forEach((estrela) => {
  estrela.addEventListener("click", () => {
    estrelasSelecionadas = estrela.dataset.value;
    starsInput.querySelectorAll("i").forEach((e) =>
      e.classList.toggle("active", e.dataset.value <= estrelasSelecionadas)
    );
  });
});

enviarBtn.addEventListener("click", () => {
  const comentario = comentarioInput.value.trim();
  if (!comentario || estrelasSelecionadas === 0) {
    alert("Por favor, preencha sua avaliação e selecione as estrelas.");
    return;
  }

  push(refAvaliacoes, {
    nome: "Cliente",
    comentario,
    estrelas: estrelasSelecionadas,
    timestamp: Date.now()
  });

  comentarioInput.value = "";
  starsInput.querySelectorAll("i").forEach((e) => e.classList.remove("active"));
  estrelasSelecionadas = 0;

  abrirModal();
});

// ======= Modal =======
const modal = document.getElementById("modalAvaliacao");
const fecharModal = document.getElementById("fecharModal");

function abrirModal() {
  modal.style.display = "flex";
}
fecharModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// ======= Carrossel suave =======
(function () {
  const carousel = document.getElementById("avaliacoesCarousel");
  if (!carousel) return;

  let rafId = null;
  let speed = 0.7; // ← velocidade ajustada (2x mais rápido)
  let isPaused = false;

  function step() {
    if (!isPaused) {
      carousel.scrollLeft += speed;
      const half = carousel.scrollWidth / 2;
      if (carousel.scrollLeft >= half) carousel.scrollLeft -= half;
    }
    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (carousel.children.length <= 2) return;
    if (!carousel.dataset.duplicated) {
      carousel.innerHTML += carousel.innerHTML;
      carousel.dataset.duplicated = "true";
    }
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(step);
  }

  carousel.addEventListener("mouseenter", () => (isPaused = true));
  carousel.addEventListener("mouseleave", () => (isPaused = false));
  carousel.addEventListener("touchstart", () => (isPaused = true), { passive: true });
  carousel.addEventListener("touchend", () => (isPaused = false), { passive: true });

  window.__jk_carousel_reinit = start;
})();
