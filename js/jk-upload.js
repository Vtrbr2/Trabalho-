import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://gkkadwbselqwieaqpxzi.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdra2Fkd2JzZWxxd2llYXFweHppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjM2NTgsImV4cCI6MjA3ODUzOTY1OH0.sxvEHjDZ8SWiIqzHpUGwqqUUfVqzsAiartvyF2WBaZU";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const fileInput = document.getElementById("fotoInput");
const previewImg = document.getElementById("fotoPreview");

if (fileInput && previewImg) {
  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Mostra a prévia
    const reader = new FileReader();
    reader.onload = () => (previewImg.src = reader.result);
    reader.readAsDataURL(file);

    // Gera nome único
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars") // Crie o bucket "avatars" no Supabase
      .upload(fileName, file);

    if (error) {
      console.error("Erro ao enviar imagem:", error);
      alert("Erro ao enviar imagem.");
      return;
    }

    // Obter URL pública
    const { data: publicData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    const url = publicData.publicUrl;
    localStorage.setItem("avatarUrl", url);
  });
}
