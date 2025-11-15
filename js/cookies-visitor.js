// ========== BANNER ==========
const banner = document.getElementById("cookieBanner");
const acceptBtn = document.getElementById("acceptCookies");

// Verifica se já existe visitante salvo
let visitorId = localStorage.getItem("jk_visitor_id");

// Se não existir → mostrar banner
if (!visitorId) {
    banner.style.display = "block";
}

// Aceitar cookies
acceptBtn.addEventListener("click", () => {
    // Gerar ID aleatório
    const newId = "JK-" + Math.random().toString(36).substring(2, 12);
    localStorage.setItem("jk_visitor_id", newId);

    // Ocultar banner
    banner.style.display = "none";

    // Enviar ao Firebase
    enviarVisita(newId);
});

// ========== Conexão Firebase ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
    authDomain: "avaliacoes-20599.firebaseapp.com",
    databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com/",
    projectId: "avaliacoes-20599",
    storageBucket: "avaliacoes-20599.firebasestorage.app",
    messagingSenderId: "1003621715829",
    appId: "1:1003621715829:web:eb82bed77a69e570324d3c"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ========== Função de envio ==========
function enviarVisita(id) {
    const agora = Date.now();

    set(ref(db, "visitas/" + id), {
        primeira_visita: agora,
        ultima_visita: agora,
        tempo_total: 0
    });
}

// ========== Monitoramento de tempo ==========
if (visitorId) {
    const inicio = Date.now();

    window.addEventListener("beforeunload", () => {
        const fim = Date.now();
        const tempo = fim - inicio;

        update(ref(db, "visitas/" + visitorId), {
            ultima_visita: fim,
            tempo_total: tempo
        });
    });
      }
