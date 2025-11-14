// ========================
// 🔥 CONFIGURAÇÃO FIREBASE
// ========================



                
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// CONFIG FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
  authDomain: "avaliacoes-20599.firebaseapp.com",
  databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/",
  projectId: "avaliacoes-20599"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database().ref("avaliacoes");

// ELEMENTOS
const lista = document.getElementById("listaAvaliacoes");
const filtroNota = document.getElementById("filtroNota");
const filtroOrdem = document.getElementById("filtroOrdem");
const btnLoad = document.getElementById("btnCarregarMais");

let todas = [];
let pagina = 0;
const porPagina = 5;

// Buscar avaliações
db.on("value", snap => {
  todas = [];

  snap.forEach(item => {
    const v = item.val();
    todas.push({
      nome: v.nome,
      texto: v.avaliacao,
      nota: v.nota,
      data: v.data || 0
    });
  });

  aplicarFiltros();
});

// Aplicar filtros + resetar paginação
function aplicarFiltros() {
  let temp = [...todas];

  // Filtrar nota
  if (filtroNota.value) {
    temp = temp.filter(i => i.nota == filtroNota.value);
  }

  // Ordenar
  if (filtroOrdem.value === "recentes") {
    temp.sort((a,b) => b.data - a.data);
  } else {
    temp.sort((a,b) => a.data - b.data);
  }

  avaliFiltradas = temp;
  pagina = 0;
  lista.innerHTML = "";
  carregarMais();
}

let avaliFiltradas = [];

// Paginação
function carregarMais() {
  const start = pagina * porPagina;
  const end = start + porPagina;

  const bloco = avaliFiltradas.slice(start, end);

  bloco.forEach(av => criarCard(av));

  pagina++;

  if (end >= avaliFiltradas.length) {
    btnLoad.style.display = "none";
  } else {
    btnLoad.style.display = "block";
  }
}

// Criar card
function criarCard(av) {
  const card = document.createElement("div");
  card.className = "card-av";

  const dataFormatada = av.data 
    ? new Date(av.data).toLocaleString("pt-BR")
    : "Data não registrada";

  card.innerHTML = `
    <div class="card-top">
      <span class="card-nome">${av.nome}</span>
      <span class="card-nota">${"⭐".repeat(av.nota)}</span>
    </div>
    <div class="card-data">${dataFormatada}</div>
    <p>${av.texto.substring(0,120)}...</p>
  `;

  card.onclick = () => abrirModal(av);
  lista.appendChild(card);
}

// MODAL
const modal = document.getElementById("modalAvaliacao");
const fechar = document.getElementById("fecharModal");

function abrirModal(av) {
  modal.style.display = "flex";
  document.getElementById("modalNome").innerText = av.nome;
  document.getElementById("modalNota").innerText = "Nota: " + av.nota;
  document.getElementById("modalData").innerText =
    new Date(av.data).toLocaleString("pt-BR");
  document.getElementById("modalTexto").innerText = av.texto;
}

fechar.onclick = () => modal.style.display = "none";
modal.onclick = e => { if (e.target === modal) modal.style.display = "none"; };

// listeners
filtroNota.onchange = aplicarFiltros;
filtroOrdem.onchange = aplicarFiltros;
btnLoad.onclick = carregarMais;
// ===========================
//   by: @vitorrodrigues
// ===========================

