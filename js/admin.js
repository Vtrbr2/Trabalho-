import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// === CONFIGURAÇÃO FIREBASE ===
const firebaseConfig = {
  apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
  authDomain: "avaliacoes-20599.firebaseapp.com",
  projectId: "avaliacoes-20599",
  storageBucket: "avaliacoes-20599.firebasestorage.app",
  messagingSenderId: "1003621715829",
  appId: "1:1003621715829:web:eb82bed77a69e570324d3c",
  databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// === LOGIN SIMPLES ===
const adminUser = "admin";  // usuário definido
const adminPass = "1234";   // senha definida

const loginDiv = document.getElementById("login");
const painelDiv = document.getElementById("painel");
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  const user = document.getElementById("user").value.trim();
  const pass = document.getElementById("pass").value.trim();

  if (user === adminUser && pass === adminPass) {
    loginDiv.style.display = "none";
    painelDiv.style.display = "block";
    carregarAvaliacoes();
  } else {
    alert("Usuário ou senha incorretos.");
  }
});

// === LISTAR AVALIAÇÕES ===
const lista = document.getElementById("listaAvaliacoes");
const totalAtivasSpan = document.getElementById("totalAtivas");
const totalExcluidasSpan = document.getElementById("totalExcluidas");
const buscaInput = document.getElementById("buscaAvaliacoes");

let avaliacoesAtuais = {};  // armazenar avaliações localmente

function carregarAvaliacoes() {
  const avaliacoesRef = ref(db, "avaliacoes");

  onValue(avaliacoesRef, (snapshot) => {
    lista.innerHTML = "";
    avaliacoesAtuais = {}; // resetar

    let totalAtivas = 0;
    let totalExcluidas = 0;

    snapshot.forEach((child) => {
      const data = child.val();
      const id = child.key;
      avaliacoesAtuais[id] = data;

      totalAtivas++; // contador de ativas

      const div = document.createElement("div");
      div.className = "avaliacao-admin";
      div.dataset.id = id;
      div.innerHTML = `
        <p><strong>${data.nome || "Anônimo"}</strong> — ${data.estrelas} ⭐</p>
        <p>${data.comentario}</p>
        <button class="btn-excluir" data-id="${id}">Excluir</button>
      `;
      lista.appendChild(div);
    });

    totalAtivasSpan.textContent = totalAtivas;
    totalExcluidasSpan.textContent = totalExcluidas;

    // adicionar evento aos botões de excluir
    document.querySelectorAll(".btn-excluir").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        abrirModal(id);
      });
    });
  });
}

// === MODAL DE CONFIRMAÇÃO ===
const modal = document.getElementById("modalConfirm");
const confirmSim = document.getElementById("confirmSim");
const confirmNao = document.getElementById("confirmNao");
let avaliacaoSelecionada = null;

function abrirModal(id) {
  avaliacaoSelecionada = id;
  modal.style.display = "flex";
}

confirmNao.addEventListener("click", () => {
  modal.style.display = "none";
  avaliacaoSelecionada = null;
});

confirmSim.addEventListener("click", () => {
  if (avaliacaoSelecionada) {
    excluirAvaliacao(avaliacaoSelecionada);
    avaliacaoSelecionada = null;
  }
  modal.style.display = "none";
});

// === FUNÇÃO EXCLUIR ===
function excluirAvaliacao(id) {
  const avaliacaoRef = ref(db, "avaliacoes/" + id);
  remove(avaliacaoRef)
    .then(() => alert("Avaliação excluída com sucesso!"))
    .catch((err) => alert("Erro ao excluir: " + err));
}

// === FILTRAR BUSCA ===
buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase();

  document.querySelectorAll(".avaliacao-admin").forEach(div => {
    const nome = div.querySelector("p strong").textContent.toLowerCase();
    const comentario = div.querySelectorAll("p")[1].textContent.toLowerCase();
    div.style.display = (nome.includes(termo) || comentario.includes(termo)) ? "block" : "none";
  });
});
