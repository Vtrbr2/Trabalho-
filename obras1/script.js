// Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Interação para portfólio
        const portfolioCards = document.querySelectorAll('.portfolio-card');
        
        portfolioCards.forEach(card => {
            card.addEventListener('click', function() {
                portfolioCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Remove active ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.portfolio-card')) {
                portfolioCards.forEach(c => c.classList.remove('active'));
            }
        });

//menu
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
        // Interação mobile para galeria
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active de todos
                galleryItems.forEach(i => i.classList.remove('active'));
                // Adiciona active no clicado
                this.classList.add('active');
            });
        });

        // Remove active ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.gallery-item')) {
                galleryItems.forEach(i => i.classList.remove('active'));
            }
        });
