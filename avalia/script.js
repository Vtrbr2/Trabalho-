// ========================
// 🔥 CONFIGURAÇÃO FIREBASE
// ========================
const firebaseConfig = {
    apiKey: "SUA_APIKEY",
    authDomain: "SEU_AUTH",
    databaseURL: "SUA_DATABASE_URL",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_BUCKET",
    messagingSenderId: "SENDER",
    appId: "APPID"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();


// ===========================
// 🔥 FUNÇÃO PRINCIPAL
// Carrega avaliações do Firebase
// ===========================
function carregarAvaliacoes() {
    db.ref("avaliacoes").on("value", (snapshot) => {
        const lista = [];

        snapshot.forEach((child) => {
            lista.push({
                nome: child.val().nome || "Usuário",
                comentario: child.val().comentario || "",
                estrelas: child.val().estrelas || 5,
                fotoUrl: child.val().fotoUrl || "img/user-default.png"
            });
        });

        // Monta seção completa
        carregarAvaliacoesCompleto(lista);

        // Se você tiver carrossel
        // montarCarrossel(lista);
    });
}



// ===========================
// 🔥 NOVA SEÇÃO COMPLETA
// (a que você pediu)
// ===========================
function carregarAvaliacoesCompleto(lista) {
    const container = document.getElementById("avaliacoesLista");
    if (!container) return;

    container.innerHTML = "";

    lista.forEach((av) => {
        container.innerHTML += `
            <div class="avaliacao-card">
                <img src="${av.fotoUrl}" class="avaliacao-foto">

                <div class="avaliacao-nome">${av.nome}</div>

                <div class="avaliacao-estrelas">
                    ${"★".repeat(av.estrelas)}${"☆".repeat(5 - av.estrelas)}
                </div>

                <p class="avaliacao-texto">${av.comentario}</p>
            </div>
        `;
    });
}



// ===========================
// 🔥 INICIAR
// ===========================
carregarAvaliacoes();


// ===========================
//   by: @vitorrodrigues
// ===========================

