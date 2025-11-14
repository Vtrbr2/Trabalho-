// ========================
// by: @vitorrodrigues
// ========================


const firebaseConfig = {
    apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
    authDomain: "avaliacoes-20599.firebaseapp.com",
    databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/",
    projectId: "avaliacoes-20599",
    storageBucket: "avaliacoes-20599.firebasestorage.app",
    messagingSenderId: "1003621715829",
    appId: "1:1003621715829:web:eb82bed77a69e570324d3c"
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
