// Corrige velocidade do carrossel no mobile e animações manuais
const track = document.querySelector(".carousel-track");

let velocidade = 25; // segundos
let posicao = 0;

function deslizar() {
    posicao -= 1; 

    if (Math.abs(posicao) >= track.scrollWidth / 2) {
        posicao = 0;
    }

    track.style.transform = `translateX(${posicao}px)`;
}

setInterval(deslizar, velocidade);

/* Extra: animação do botão CTA */
document.querySelector(".btn-cta")?.addEventListener("mouseover", () => {
    document.querySelector(".btn-cta").style.transform = "scale(1.03)";
});

document.querySelector(".btn-cta")?.addEventListener("mouseout", () => {
    document.querySelector(".btn-cta").style.transform = "scale(1)";
});
