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



// js/jk-avaliacoes.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ========== CONFIG (já informadas por você) ==========
const SUPABASE_URL = 'https://gkkadwbselqwieaqpxzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU';
// ======================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// IDs / seletores usados (únicos)
const SELECTORS = {
  carousel: 'jk-avaliacoes-carousel',
  openBtn: 'jk-openReviewBtn',
  modal: 'jk-reviewModal',
  closeBtn: 'jk-closeModal',
  form: 'jk-reviewForm',
  starsContainer: 'jk-stars',
  estrelasInput: 'jk-revEstrelas',
  nomeInput: 'jk-revNome',
  msgInput: 'jk-revMsg',
  formMsg: 'jk-formMsg'
};

// --- util: procura elemento e retorna null se não existir (protege outros scripts) ---
const $ = (id) => document.getElementById(id) || null;

// escape básico
const escapeHtml = (s) =>
  String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

async function fetchAvaliacoes() {
  const carouselEl = $(SELECTORS.carousel);
  if (!carouselEl) return;
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .order('criado_at', { ascending: false })
      .limit(20);

    if (error) { console.error('Supabase fetch error', error); return; }
    renderAvaliacoes(data);
  } catch (err) {
    console.error(err);
  }
}

function renderAvaliacoes(items = []) {
  const carouselEl = $(SELECTORS.carousel);
  if (!carouselEl) return;
  carouselEl.innerHTML = '';
  if (!items.length) {
    const p = document.createElement('p');
    p.textContent = 'Nenhuma avaliação publicada ainda. Seja o primeiro!';
    p.style.color = '#6b7280';
    carouselEl.appendChild(p);
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'jk-avaliacao-card';

    const stars = document.createElement('div');
    stars.className = 'jk-avaliacao-stars';
    const filled = '★'.repeat(item.estrelas);
    const empty = '☆'.repeat(5 - item.estrelas);
    stars.textContent = filled + empty;

    const msg = document.createElement('div');
    msg.className = 'jk-avaliacao-msg';
    msg.textContent = item.mensagem;

    const author = document.createElement('div');
    author.className = 'jk-avaliacao-author';
    author.textContent = `— ${item.nome}`;

    card.appendChild(stars);
    card.appendChild(msg);
    card.appendChild(author);
    carouselEl.appendChild(card);
  });
}

// --- modal & estrelas ---
function initUI() {
  const openBtn = $(SELECTORS.openBtn);
  const modal = $(SELECTORS.modal);
  const closeBtn = $(SELECTORS.closeBtn);
  const form = $(SELECTORS.form);
  const starsContainer = $(SELECTORS.starsContainer);
  const estrelasInput = $(SELECTORS.estrelasInput);
  const formMsg = $(SELECTORS.formMsg);

  if (openBtn && modal) {
    openBtn.addEventListener('click', () => modal.classList.remove('jk-hidden'));
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => modal.classList.add('jk-hidden'));
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('jk-hidden');
    });
  }

  // estrelas clique (delegation)
  if (starsContainer && estrelasInput) {
    starsContainer.addEventListener('click', (e) => {
      const v = e.target?.dataset?.value;
      if (!v) return;
      const n = Number(v);
      estrelasInput.value = n;
      Array.from(starsContainer.children).forEach(s => {
        s.classList.toggle('jk-active', Number(s.dataset.value) <= n);
      });
    });
  }

  // submit
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      if (!form) return;
      const nomeEl = $(SELECTORS.nomeInput);
      const msgEl = $(SELECTORS.msgInput);
      const estrelasEl = $(SELECTORS.estrelasInput);
      if (!nomeEl || !msgEl || !estrelasEl) return;
      const nome = nomeEl.value.trim();
      const mensagem = msgEl.value.trim();
      const estrelas = Number(estrelasEl.value) || 5;

      if (!nome || !mensagem) {
        if (formMsg) { formMsg.style.color = 'red'; formMsg.textContent = 'Preencha nome e mensagem.'; }
        return;
      }

      if (formMsg) { formMsg.style.color = 'inherit'; formMsg.textContent = 'Enviando...'; }
      try {
        const { data, error } = await supabase.from('avaliacoes').insert([{ nome, mensagem, estrelas }]);
        if (error) {
          if (formMsg) { formMsg.style.color = 'red'; formMsg.textContent = 'Erro ao enviar. Tente novamente.'; }
          console.error(error);
          return;
        }
        if (formMsg) { formMsg.style.color = 'green'; formMsg.textContent = 'Obrigado! Avaliação enviada.'; }
        form.reset();
        estrelasEl.value = 5;
        if (starsContainer) Array.from(starsContainer.children).forEach(s => s.classList.remove('jk-active'));
        // fechar modal com leve delay visual
        setTimeout(() => {
          const modalEl = $(SELECTORS.modal);
          if (modalEl) modalEl.classList.add('jk-hidden');
        }, 500);
        // atualizar lista
        fetchAvaliacoes();
      } catch (err) {
        console.error(err);
        if (formMsg) { formMsg.style.color = 'red'; formMsg.textContent = 'Erro desconhecido.'; }
      }
    });
  }
}

// --- realtime subscription (adiciona chamadas para atualizar) ---
function initRealtime() {
  try {
    const channel = supabase.channel('public:avaliacoes');
    channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'avaliacoes' }, () => {
      // busca novamente ao receber insert
      fetchAvaliacoes();
    }).subscribe().catch(err => {
      // fallback: log (não crítico)
      console.warn('Realtime subscribe error', err);
    });
  } catch (err) {
    console.warn('Realtime init fail', err);
  }
}

// --- init tudo depois do DOM carregar (protege outros scripts) ---
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initUI(); fetchAvaliacoes(); initRealtime();
  });
} else {
  initUI(); fetchAvaliacoes(); initRealtime();
                                       }
