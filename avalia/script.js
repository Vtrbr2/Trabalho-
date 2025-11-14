// ========================
// 🔥 CONFIGURAÇÃO FIREBASE
// ========================



                
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
  authDomain: "avaliacoes-20599.firebaseapp.com",
  databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/",
  projectId: "avaliacoes-20599",
  storageBucket: "avaliacoes-20599.firebasestorage.app",
  messagingSenderId: "1003621715829",
  appId: "1:1003621715829:web:eb82bed77a69e570324d3c"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const refAvaliacoes = ref(db, "avaliacoes");

// Elemento que recebe as avaliações
const lista = document.getElementById("listaAvaliacoes");

// Carregar avaliações completas
onValue(refAvaliacoes, (snapshot) => {
  lista.innerHTML = ""; // limpar

  snapshot.forEach(child => {
    const dados = child.val();

    const item = document.createElement("div");
    item.classList.add("avaliacao-item");

    item.innerHTML = `
      <div class="avaliacao-estrelas">${"★".repeat(dados.estrelas)}</div>
      <h3>${dados.nome || "Anônimo"}</h3>
      <p>${dados.comentario}</p>
    `;

    lista.appendChild(item);
  });
});



// ===========================
//   by: @vitorrodrigues
// ===========================

