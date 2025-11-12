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



 type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  // --------- CONFIG: altera aqui com suas chaves ----------
  const SUPABASE_URL = 'https://gkkadwbselqwieaqpxzi.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU';
  // --------------------------------------------------------

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const carouselEl = document.getElementById('avaliacoesCarousel');
  const openReviewBtn = document.getElementById('openReviewBtn');
  const reviewModal = document.getElementById('reviewModal');
  const closeModal = document.getElementById('closeModal');
  const reviewForm = document.getElementById('reviewForm');
  const formMsg = document.getElementById('formMsg');
  const starsEl = document.getElementById('stars');
  const revEstrelas = document.getElementById('revEstrelas');

  // estrelas interativas
  starsEl.addEventListener('click', (e) => {
    if (e.target.dataset && e.target.dataset.value) {
      const v = Number(e.target.dataset.value);
      revEstrelas.value = v;
      Array.from(starsEl.children).forEach(s => {
        s.classList.toggle('active', Number(s.dataset.value) <= v);
      });
    }
  });

  // abrir/fechar modal
  openReviewBtn.addEventListener('click', () => reviewModal.classList.remove('hidden'));
  closeModal.addEventListener('click', () => reviewModal.classList.add('hidden'));
  reviewModal.addEventListener('click', (e) => { if (e.target === reviewModal) reviewModal.classList.add('hidden'); });

  // buscar avaliações
  async function fetchAvaliacoes() {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .order('criado_at', { ascending: false })
      .limit(20);
    if (error) { console.error(error); return; }
    renderAvaliacoes(data);
  }

  // renderiza cards no carrossel
  function renderAvaliacoes(items) {
    carouselEl.innerHTML = '';
    if (!items || items.length === 0) {
      carouselEl.innerHTML = '<p>Nenhuma avaliação publicada ainda. Seja o primeiro!</p>';
      return;
    }
    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'avaliacao-card';
      card.innerHTML = `
        <div class="avaliacao-stars">${'★'.repeat(item.estrelas)}${'☆'.repeat(5-item.estrelas)}</div>
        <div class="avaliacao-msg">${escapeHtml(item.mensagem)}</div>
        <div class="avaliacao-author">— ${escapeHtml(item.nome)}</div>
      `;
      carouselEl.appendChild(card);
    });
  }

  // submit form
  reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('revNome').value.trim();
    const mensagem = document.getElementById('revMsg').value.trim();
    const estrelas = Number(document.getElementById('revEstrelas').value) || 5;

    if (!nome || !mensagem) { formMsg.style.color = 'red'; formMsg.textContent = 'Preencha nome e mensagem.'; return; }

    formMsg.textContent = 'Enviando...';
    const { data, error } = await supabase.from('avaliacoes').insert([{ nome, mensagem, estrelas }]);
    if (error) {
      formMsg.style.color = 'red';
      formMsg.textContent = 'Erro ao enviar. Tente novamente.';
      console.error(error);
      return;
    }

    formMsg.style.color = 'green';
    formMsg.textContent = 'Obrigado! Avaliação enviada.';
    reviewForm.reset();
    // reset estrelas
    revEstrelas.value = 5;
    Array.from(starsEl.children).forEach(s => s.classList.remove('active'));
    reviewModal.classList.add('hidden');

    // atualizar lista (fetch)
    fetchAvaliacoes();
  });

  // subscribe para mudanças em tempo real (recebe inserts)
  const channel = supabase.channel('public:avaliacoes');
  channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'avaliacoes' }, payload => {
    // adiciona novo item no topo
    fetchAvaliacoes();
  }).subscribe();

  // escape simples para injeção
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // inicial
  fetchAvaliacoes();
