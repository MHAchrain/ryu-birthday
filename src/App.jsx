import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppRoutes from "./routes";

// OBJEK GLOBAL - Tidak tersentuh Re-render
const player = {
  instance: new Audio(),
  currentCategory: "", // 'menu' atau 'cake'
  fadeTimer: null
};

player.instance.loop = true;

const switchMusic = (category) => {
  // JIKA KATEGORI SAMA, STOP! Jangan pause, jangan reset.
  if (player.currentCategory === category) return;
  
  player.currentCategory = category;
  const src = category === "cake" ? "/audio/cake-bgm.mp3" : "/audio/menu-bgm.mp3";

  if (player.fadeTimer) clearInterval(player.fadeTimer);

  // FADE OUT & SWITCH
  player.fadeTimer = setInterval(() => {
    if (player.instance.volume > 0.05) {
      player.instance.volume -= 0.05;
    } else {
      clearInterval(player.fadeTimer);
      player.instance.pause();
      player.instance.src = src;
      player.instance.load();
      player.instance.play().catch(() => {});

      // FADE IN
      player.fadeTimer = setInterval(() => {
        if (player.instance.volume < 0.4) {
          player.instance.volume = Math.min(player.instance.volume + 0.05, 0.4);
        } else {
          clearInterval(player.fadeTimer);
        }
      }, 50);
    }
  }, 50);
};

function AudioController() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    
    // Kelompokkan Halaman
    if (path === "/cake" || path === "/final") {
      switchMusic("cake"); // Kategori sama untuk kedua page ini
    } else {
      switchMusic("menu");
    }
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <>
      <AudioController />
      <AppRoutes />
    </>
  );
}