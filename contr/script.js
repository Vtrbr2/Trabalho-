
        // Cronômetro Black Friday
        const countDownDate = new Date("November 29, 2025 00:00:00").getTime();

        const x = setInterval(function() {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = days.toString().padStart(2, '0');
            document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
            document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
            document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');

            if (distance < 0) {
                clearInterval(x);
                document.getElementById("days").textContent = "00";
                document.getElementById("hours").textContent = "00";
                document.getElementById("minutes").textContent = "00";
                document.getElementById("seconds").textContent = "00";
            }
        }, 1000);

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
        // FAQ Accordion
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = question.classList.contains('active');
                
                // Fechar todas as outras
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                });
                
                // Toggle da pergunta clicada
                if (!isActive) {
                    question.classList.add('active');
                    answer.classList.add('active');
                }
            });
        });
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
  
