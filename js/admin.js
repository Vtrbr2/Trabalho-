import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// --- CONFIG DO FIREBASE ---
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

// --- LOGIN SIMPLES ---
const adminUser = "admin";
const adminPass = "1234";

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

// --- LISTAR E APAGAR AVALIAÇÕES ---
function carregarAvaliacoes() {
  const lista = document.getElementById("listaAvaliacoes");
  const avaliacoesRef = ref(db, "avaliacoes");

  onValue(avaliacoesRef, (snapshot) => {
    lista.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const id = child.key;

      const div = document.createElement("div");
      div.className = "avaliacao-admin";
      div.innerHTML = `
        <p><strong>${data.nome}</strong> — ${data.estrelas} ⭐</p>
        <p>${data.texto}</p>
        <button class="btn-excluir" data-id="${id}">Excluir</button>
      `;

      lista.appendChild(div);
    });

    // adiciona evento aos botões
    document.querySelectorAll(".btn-excluir").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        excluirAvaliacao(id);
      });
    });
  });
}

function excluirAvaliacao(id) {
  const avaliacaoRef = ref(db, "avaliacoes/" + id);
  remove(avaliacaoRef)
    .then(() => alert("Avaliação excluída com sucesso!"))
    .catch((err) => alert("Erro ao excluir: " + err));
      }
