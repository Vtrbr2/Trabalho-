// jk-upload-preview.js
(function(){
  const input = document.getElementById('avatarInput');
  const preview = document.getElementById('avatarPreview');
  if (!input || !preview) return;

  input.addEventListener('change', () => {
    preview.innerHTML = '';
    const file = input.files && input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      preview.textContent = 'Selecione uma imagem.';
      return;
    }
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = 'Preview avatar';
    preview.appendChild(img);
  });
})();
