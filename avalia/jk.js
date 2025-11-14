const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('.nav-menu');
const closeNav = document.querySelector('.close-nav');
const navLinks = document.querySelectorAll('.nav-menu a');

menuBtn.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  menuBtn.classList.toggle('open');
});

closeNav.addEventListener('click', () => {
  navMenu.classList.remove('open');
  menuBtn.classList.remove('open');
});

// Fecha o menu ao clicar em um link (mobile)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuBtn.classList.remove('open');
  });
});
