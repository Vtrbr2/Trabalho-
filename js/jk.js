const btn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav-menu');
btn.addEventListener('click', () => {
  nav.classList.toggle('open');
  btn.classList.toggle('open');
});

// Opcional: fecha menu ao clicar em um link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    btn.classList.remove('open');
  });
});

window.addEventListener("scroll", () => {
  const nav = document.querySelector(".navbar");
  if (window.scrollY > 0) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }
});
// FAQ com animação
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-question");

  btn.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});


document.addEventListener('click', function(e){
  const btn = e.target.closest('.servico-btn');
  if (!btn) return;
  // encontra o card pai e pega a URL
  const card = btn.closest('.servico-card');
  const href = (card && (card.dataset.href || card.getAttribute('data-href'))) || btn.dataset.href;
  if (!href) return;
  // abre no mesmo tab (use window.open(href, '_blank') para nova aba)
  window.location.href = href;
});
