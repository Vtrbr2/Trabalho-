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
