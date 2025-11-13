// js/jk-upload.js
// Responsável pelo upload da foto no Supabase e integração com Firebase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { getDatabase, ref as dbRef, push as dbPush } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

/* ===== CONFIG SUPABASE ===== */
const SUPABASE_URL = 'https://gkkadwbselqwieaqpxzi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BUCKET_NAME = 'fotos_perfil';

/* ===== CONFIG FIREBASE ===== */
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
if (getApps().length === 0) app = initializeApp(firebaseConfig);
else app = getApps()[0];

const db = getDatabase(app);

/* ===== ELEMENTOS ===== */
const form = document.getElementById('avaliacaoForm');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');

/* ===== PREVIEW ===== */
if (avatarInput) {
  avatarInput.addEventListener('change', () => {
    const file = avatarInput.files?.[0];
    avatarPreview.innerHTML = '';
    if (!file) return;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.style.width = '80px';
    img.style.height = '80px';
    img.style.borderRadius = '50%';
    img.style.objectFit = 'cover';
    avatarPreview.appendChild(img);
  });
}

/* ===== FUNÇÃO UPLOAD ===== */
async function uploadFoto(file) {
  if (!file) return null;
  const ext = file.name.split('.').pop();
  const path = `avatar_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(path, file, { upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

/* ===== ENVIO COMPLETO (SUBSTITUI O FORM PADRÃO) ===== */
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome')?.value || 'Anônimo';
    const mensagem = document.getElementById('mensagem')?.value || '';
    const estrelas = document.querySelectorAll('.estrela.ativa').length || 5;

    const file = avatarInput?.files?.[0];
    let photoUrl = null;

    try {
      if (file) {
        photoUrl = await uploadFoto(file);
      }

      await dbPush(dbRef(db, 'avaliacoes'), {
        nome,
        mensagem,
        estrelas,
        photoUrl,
        data: new Date().toISOString()
      });

      form.reset();
      avatarPreview.innerHTML = '';

      // Mostra modal de sucesso se existir
      const modal = document.getElementById('modalSucesso');
      if (modal) {
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('hidden'), 1800);
      } else {
        alert('Avaliação enviada com sucesso!');
      }

    } catch (err) {
      console.error('Erro ao enviar:', err);
      alert('Erro ao enviar a avaliação.');
    }
  });
  }
