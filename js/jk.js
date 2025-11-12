        // --- Função para o Menu Mobile (Hambúrguer) ---
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    // 1. Alternar (toggle) o Menu
    burger.addEventListener('click', () => {
        // Trazer o menu 'nav-links'
        nav.classList.toggle('nav-active');
        
        // 2. Animar os Links (fade-in)
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''; // Reseta a animação se o menu for fechado
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // 3. Animação do Hambúrguer (para "X")
        burger.classList.toggle('toggle');
    });
}

// --- Função para a Navbar "Sticky" (Animação de Scroll) ---
const stickyNav = () => {
    const navbar = document.querySelector('.navbar');
    
    // Adiciona um "ouvinte" de evento de scroll
    window.addEventListener('scroll', () => {
        // Se a posição Y da rolagem for maior que 10 pixels
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// --- Chamar as funções ---
navSlide();
stickyNav();
