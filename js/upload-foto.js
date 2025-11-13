// js/upload-foto.js
// Módulo responsável por: upload ao Supabase Storage + salvar no Firebase Realtime DB
// Requisitos: colocar <input id="avatarInput"> no form, e ter ids 'nome','mensagem' e seleção de estrelas com id 'estrelas' (ou adaptar).

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref as fbRef, push as fbPush } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

/* =========== CONFIG SUPABASE =========== */
// confirma o supabaseUrl e a anon key (fornecidas por você)
const SUPABASE_URL = 'https://gkkadwbselqwieaqpxzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// bucket onde serão armazenadas as fotos (confirme o nome)
const BUCKET_NAME = 'fotos_perfil';

/* =========== CONFIG FIREBASE (reutiliza se já inicializado) =========== */
// se você já inicializou Firebase em outro script modular, o getApps() retorna >0
const firebaseConfig = {
  apiKey: "AIzaSyBF_-yFhm5X3Dy-jd84dHyU4UT5Uta-XhE",
  authDomain: "avaliacoes-20599.firebaseapp.com",
  databaseURL: "https://avaliacoes-20599-default-rtdb.firebaseio.com",
  projectId: "avaliacoes-20599",
  storageBucket: "avaliacoes-20599.firebasestorage.app",
  messagingSenderId: "1003621715829",
  appId: "1:1003621715829:web:eb82bed77a69e570324d3c"
};

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const db = getDatabase(app);

/* =========== UTIL / UI SELECTORS =========== */
const form = document.getElementById('avaliacaoForm'); // seu form
const nomeEl = document.getElementById('nome');
const msgEl = document.getElementById('mensagem');
const estrelasContainer = document.getElementById('estrelas'); // se for spans com data-value
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');

if (!form) {
  console.warn('[upload-foto] form "avaliacaoForm" não encontrado — parei a inicialização do upload.');
}

// preview ao selecionar imagem
if (avatarInput && avatarPreview) {
  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files && avatarInput.files[0];
    avatarPreview.innerHTML = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      avatarPreview.textContent = 'Arquivo não é imagem.';
      return;
    }
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.maxWidth = '120px';
    img.style.maxHeight = '120px';
    img.style.borderRadius = '8px';
    avatarPreview.appendChild(img);
  });
}

/* =========== FUNÇÃO UPLOAD (Supabase Storage) =========== */
async function uploadImageToSupabase(file) {
  if (!file) return null;
  // validação simples
  const maxBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxBytes) throw new Error('Arquivo muito grande (máx 5MB).');

  const ext = file.name.split('.').pop();
  const filename = `avatar_${Date.now()}_${Math.random().toString(36).slice(2,9)}.${ext}`;
  const path = `${filename}`;

  // faz upload
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { cacheControl: '3600', upsert: false });

  if (uploadError) {
    // se for conflito de nome, pode tentar com upsert true ou novo nome
    throw uploadError;
  }

  // gerar URL pública
  const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  // publicData.publicUrl é a URL
  return publicData?.publicUrl ?? null;
}

/* =========== PEGAR VALOR DAS ESTRELAS (depende da sua estrutura) =========== */
function getSelectedStars() {
  if (!estrelasContainer) return 5; // default se não existir
  // se for spans com data-value:
  const active = Array.from(estrelasContainer.children).filter(ch => ch.classList.contains('ativo') || ch.classList.contains('active'));
  if (active.length) return active.length;
  // fallback: procurar atributo data-value marcado
  const sel = estrelasContainer.querySelector('[data-selected="true"]') || estrelasContainer.querySelector('[aria-checked="true"]');
  if (sel && sel.dataset && sel.dataset.value) return Number(sel.dataset.value);
  return 0;
}

/* =========== SUBMIT: UPLOAD + SALVAR NO FIREBASE =========== */
if (form) {
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    try {
      const nome = nomeEl ? nomeEl.value.trim() : 'Anônimo';
      const mensagem = msgEl ? msgEl.value.trim() : '';
      const estrelas = getSelectedStars();

      if (!mensagem || !nome) {
        alert('Preencha nome e comentário.');
        return;
      }

      // desabilita botão durante processo se existir
      const submitBtn = form.querySelector('button[type="submit"], button');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Enviando...'; }

      // upload da imagem (se selecionada)
      let photoUrl = null;
      const file = avatarInput && avatarInput.files && avatarInput.files[0];
      if (file) {
        try {
          photoUrl = await uploadImageToSupabase(file);
        } catch (err) {
          console.error('Erro upload imagem', err);
          alert('Erro ao enviar a foto: ' + (err.message || err));
          // reabilita e sai
          if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Enviar'; }
          return;
        }
      }

      // salvar no Firebase Realtime DB
      const pushRef = fbPush(fbRef(db, 'avaliacoes'), {
        nome,
        mensagem,
        estrelas: Number(estrelas || 0),
        photoUrl: photoUrl || null,
        criado_em: new Date().toISOString()
      });

      // sucesso: limpar UI
      form.reset();
      if (avatarPreview) avatarPreview.innerHTML = '';
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Enviar'; }

      // opcional: abrir modal de sucesso se tiver (mantém compatibilidade com seu modal)
      const modalSucesso = document.getElementById('modalSucesso') || document.getElementById('modalAvaliacao') || null;
      if (modalSucesso) {
        // se você usa modalSucesso, mostrar breve
        modalSucesso.classList.remove('hidden');
        setTimeout(() => modalSucesso.classList.add('hidden'), 1800);
      } else {
        alert('Avaliação enviada com sucesso!');
      }

    } catch (err) {
      console.error('Erro no submit', err);
      alert('Erro ao enviar avaliação. Veja console.');
      const submitBtn = form.querySelector('button[type="submit"], button');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Enviar'; }
    }
  });
}
