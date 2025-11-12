// js/jk-avaliacoes.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// 🔧 CONFIGURAÇÃO DO SUPABASE
const SUPABASE_URL = 'https://gkkadwbselqwieaqpxzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// seletor seguro
const $ = (id) => document.getElementById(id) || null;

async function fetchAvaliacoes() {
  const carouselEl = $('jk-avaliacoes-carousel');
  if (!carouselEl) return;
  try {
    const { data, error } = await supabase
      .from('avaliacoes')
      .select('*')
      .order('id', { ascending: false })
      .limit(20);

    if (error) throw error;
    renderAvaliacoes(data);
  } catch (err) {
    console.error(err);
  }
}

function renderAvaliacoes(items = []) {
  const carouselEl = $('jk-avaliacoes-carousel');
  if (!carouselEl) return;
  carouselEl.innerHTML = '';

  if (!items.length) {
    carouselEl.innerHTML = '<p>Nenhuma avaliação publicada ainda.</p>';
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'jk-avaliacao-card';

    const stars = document.createElement('div');
    stars.className = 'jk-avaliacao-stars';
    stars.textContent = '★'.repeat(item.estrelas) + '☆'.repeat(5 - item.estrelas);

    const msg = document.createElement('div');
    msg.className = 'jk-avaliacao-msg';
    msg.textContent = item.mensagem;

    const author = document.createElement('div');
    author.className = 'jk-avaliacao-author';
    author.textContent = `— ${item.nome}`;

    card.append(stars, msg, author);
    carouselEl.append(card);
  });
}

// inicialização segura
document.addEventListener('DOMContentLoaded', () => {
  fetchAvaliacoes();
});
