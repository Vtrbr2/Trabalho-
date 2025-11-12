/* jk-avaliacoes.js
   Sistema de avaliações (nome, mensagem, estrelas)
   Usa REST do Supabase (fetch). Não precisa de módulos nem import.
   Configure SUPABASE_URL e SUPABASE_ANON_KEY abaixo.
*/

(function () {
  'use strict';

  // --------------- CONFIG (coloque suas chaves aqui) ---------------
  const SUPABASE_URL = 'https://gkkadwbselqwieaqpxzi.supabase.co'; // fornecido por você
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU';
  // -----------------------------------------------------------------

  // ENDPOINT REST (tabela 'avaliacoes')
  const REST_ENDPOINT = `${SUPABASE_URL}/rest/v1/avaliacoes`;

  // HEADERS para fetch
  const REST_HEADERS = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  };

  // IDs/seletores exigidos no HTML (use exatamente esses)
  // - contêiner das avaliações: id="jk-avaliacoes-list"
  // - formulário inputs: id="jk-nome", id="jk-mensagem"
  // - botão enviar: id="jk-btn-enviar"
  // - estrelas ui: container id="jk-stars" (5 spans com data-value 1..5 serão gerados automaticamente se não existir)
  // - média exibida: id="jk-media"
  const IDs = {
    list: 'jk-avaliacoes-list',
    nome: 'jk-nome',
    mensagem: 'jk-mensagem',
    btn: 'jk-btn-enviar',
    stars: 'jk-stars',
    estrelasInput: 'jk-estrelas', // hidden input
    media: 'jk-media',
  };

  // Protege querySelector por id
  const $ = (id) => document.getElementById(id) || null;

  // Util: escape simples para evitar injeção ao inserir texto no DOM
  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Renderiza um card de avaliação
  function createCard(av) {
    const card = document.createElement('div');
    card.className = 'jk-avaliacao-card'; // seu CSS deve estilizar essa classe

    const stars = document.createElement('div');
    stars.className = 'jk-avaliacao-stars';
    const filled = '★'.repeat(Number(av.estrelas || 0));
    const empty = '☆'.repeat(5 - (Number(av.estrelas || 0)));
    stars.textContent = filled + empty;

    const msg = document.createElement('div');
    msg.className = 'jk-avaliacao-msg';
    msg.innerHTML = escapeHtml(av.mensagem);

    const author = document.createElement('div');
    author.className = 'jk-avaliacao-author';
    author.innerHTML = `— ${escapeHtml(av.nome)}`;

    const dateEl = document.createElement('div');
    dateEl.className = 'jk-avaliacao-date';
    if (av.criado_at) {
      const d = new Date(av.criado_at);
      dateEl.textContent = d.toLocaleDateString();
    }

    card.appendChild(stars);
    card.appendChild(msg);
    card.appendChild(author);
    card.appendChild(dateEl);
    return card;
  }

  // Busca avaliações via REST Supabase
  async function fetchAvaliacoes() {
    const listEl = $(IDs.list);
    if (!listEl) return;

    // mostra loading simples
    listEl.innerHTML = '<p style="opacity:.7">Carregando avaliações...</p>';

    try {
      // Query: select * order by criado_at desc limit 20
      // Usamos query params: ?select=*&order=criado_at.desc&limit=20
      const url = `${REST_ENDPOINT}?select=*&order=criado_at.desc&limit=50`;
      const res = await fetch(url, { headers: REST_HEADERS, method: 'GET' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // calcular média
      let media = null;
      if (Array.isArray(data) && data.length) {
        const soma = data.reduce((s, it) => s + (Number(it.estrelas) || 0), 0);
        media = (soma / data.length);
      }

      renderAvaliacoes(data || [], media);
    } catch (err) {
      console.error('fetchAvaliacoes erro', err);
      listEl.innerHTML = '<p style="color:#b00">Não foi possível carregar avaliações.</p>';
    }
  }

  // Rendeira lista + média no topo
  function renderAvaliacoes(items, media) {
    const listEl = $(IDs.list);
    const mediaEl = $(IDs.media);
    if (!listEl) return;

    listEl.innerHTML = '';
    if (mediaEl) {
      if (media === null) {
        mediaEl.textContent = '';
      } else {
        mediaEl.textContent = `Média: ${media.toFixed(1)} / 5 (${items.length})`;
      }
    }

    if (!items.length) {
      listEl.innerHTML = '<p style="opacity:.7">Nenhuma avaliação ainda. Seja o primeiro!</p>';
      return;
    }

    // cria fragment e anexa
    const frag = document.createDocumentFragment();
    items.forEach(it => {
      frag.appendChild(createCard(it));
    });
    listEl.appendChild(frag);
  }

  // Cria UI de 5 estrelas dentro do container se não existir
  function ensureStarsUI() {
    const starsContainer = $(IDs.stars);
    const estrelasInput = $(IDs.estrelasInput);

    // se não houver input hidden, cria
    if (!estrelasInput) {
      const inp = document.createElement('input');
      inp.type = 'hidden';
      inp.id = IDs.estrelasInput;
      inp.value = '5';
      // coloca no final do body para evitar conflitos
      document.body.appendChild(inp);
    }

    if (!starsContainer) {
      // tenta achar um local sensato: procurar por um form container com id 'jk-avaliacao-form' - se não existir, cria abaixo do botão
      const possible = document.querySelector('#jk-btn-enviar') || document.querySelector('#btnEnviarAvaliacao') || null;
      const parent = possible ? possible.parentElement : document.body;
      const sc = document.createElement('div');
      sc.id = IDs.stars;
      sc.className = 'jk-stars';
      sc.setAttribute('aria-label', 'Nota (1 a 5 estrelas)');

      for (let i = 1; i <= 5; i++) {
        const s = document.createElement('span');
        s.dataset.value = String(i);
        s.textContent = '☆';
        s.style.cursor = 'pointer';
        s.style.fontSize = '22px';
        s.style.marginRight = '8px';
        sc.appendChild(s);
      }
      parent.insertBefore(sc, possible ? possible : null); // se parent for body e possible null, insere no final
    }
  }

  // Inicializa comportamento das estrelas (clique delegação)
  function initStarsBehavior() {
    const starsContainer = $(IDs.stars);
    const estrelasInput = $(IDs.estrelasInput) || (function () {
      const tmp = document.createElement('input'); tmp.type = 'hidden'; tmp.id = IDs.estrelasInput; tmp.value = '5'; document.body.appendChild(tmp); return tmp;
    })();

    if (!starsContainer) return;

    // clique
    starsContainer.addEventListener('click', (ev) => {
      const v = ev.target && ev.target.dataset && ev.target.dataset.value;
      if (!v) return;
      const n = Number(v);
      estrelasInput.value = String(n);
      // atualizar visual
      Array.from(starsContainer.children).forEach(ch => {
        const val = Number(ch.dataset.value || 0);
        ch.textContent = val <= n ? '★' : '☆';
      });
    });

    // hover (opcional): mostra preview
    starsContainer.addEventListener('mouseover', (ev) => {
      const v = ev.target && ev.target.dataset && ev.target.dataset.value;
      if (!v) return;
      const n = Number(v);
      Array.from(starsContainer.children).forEach(ch => {
        const val = Number(ch.dataset.value || 0);
        ch.textContent = val <= n ? '★' : '☆';
      });
    });
    starsContainer.addEventListener('mouseout', () => {
      const cur = Number((document.getElementById(IDs.estrelasInput) || { value: 5 }).value || 5);
      Array.from(starsContainer.children).forEach(ch => {
        const val = Number(ch.dataset.value || 0);
        ch.textContent = val <= cur ? '★' : '☆';
      });
    });
  }

  // Envia avaliação via REST (POST)
  async function enviarAvaliacaoREST({ nome, mensagem, estrelas }) {
    try {
      const body = JSON.stringify({ nome, mensagem, estrelas });
      const res = await fetch(REST_ENDPOINT, {
        method: 'POST',
        headers: REST_HEADERS,
        body,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${text}`);
      }
      // prefer return representation to get objeto criado (mas REST default não retorna; supabase accepts Prefer header)
      return true;
    } catch (err) {
      console.error('enviarAvaliacaoREST erro', err);
      throw err;
    }
  }

  // Hook do botão enviar
  function initEnviarBotao() {
    const btn = $('jk-btn-enviar') || $('btnEnviarAvaliacao') || null;
    const nomeEl = $('jk-nome') || $('nome') || null;
    const msgEl = $('jk-mensagem') || $('mensagem') || null;
    const estrelasEl = $(IDs.estrelasInput);

    if (!btn) return;

    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!nomeEl || !msgEl) {
        alert('Formulário incompleto: IDs esperados jk-nome e jk-mensagem (ou nome e mensagem).');
        return;
      }
      const nome = String(nomeEl.value || '').trim();
      const mensagem = String(msgEl.value || '').trim();
      const estrelas = Number((estrelasEl && estrelasEl.value) || 5);

      if (!nome || !mensagem) {
        alert('Preencha nome e a mensagem antes de enviar.');
        return;
      }

      // UI feedback mínimo
      btn.disabled = true;
      const oldText = btn.innerText;
      btn.innerText = 'Enviando...';

      try {
        await enviarAvaliacaoREST({ nome, mensagem, estrelas });
        // limpar campos
        nomeEl.value = '';
        msgEl.value = '';
        if (estrelasEl) estrelasEl.value = '5';
        // atualizar lista
        await fetchAvaliacoes();
        // feedback para usuário
        btn.innerText = 'Enviado ✓';
        setTimeout(() => { btn.innerText = oldText; btn.disabled = false; }, 900);
      } catch (err) {
        alert('Erro ao enviar avaliação. Tente novamente mais tarde.');
        btn.innerText = oldText;
        btn.disabled = false;
      }
    });
  }

  // Inicialização: cria UI auxiliar se necessário e liga tudo
  function init() {
    // só inicia após DOM carregado
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // garante existência de elementos essenciais (não quebra se faltar)
    // cria UI das estrelas se não houver
    ensureStarsUI();
    initStarsBehavior();
    initEnviarBotao();
    fetchAvaliacoes();

    // opcional: polling leve (a cada 40s) para manter atualizado sem realtime
    setInterval(fetchAvaliacoes, 40000);
  }

  // start
  init();

  // Expor função de refresh globalmente só se necessário (evita conflitos)
  try {
    if (!window.JK_AVALIACOES) window.JK_AVALIACOES = {};
    window.JK_AVALIACOES.refresh = fetchAvaliacoes;
  } catch (e) { /* ignore */ }

})();
