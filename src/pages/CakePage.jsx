import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { birthdayData } from "../data/data";
import { useNavigate } from "react-router-dom";

export default function CakePage() {
  const [stage, setStage] = useState("ready"); // ready, blown
  const [isLitinMati, setIsLitinMati] = useState(false);
  const isLitinMatiRef = useRef(false);
  const audioContextRef = useRef(null);
  const navigate = useNavigate();

  // --- LOGIKA MIC (TETAP) ---
  useEffect(() => {
    if (stage === "ready") startMic();
    return () => audioContextRef.current?.close();
  }, [stage]);

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
      await audioContextRef.current.resume();
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 1024;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.fftSize);

      const checkBlow = () => {
        if (isLitinMatiRef.current) return;
        analyser.getByteTimeDomainData(dataArray);
        const volume = Math.sqrt(
          dataArray.reduce((sum, val) => {
            const normalized = (val - 128) / 128;
            return sum + normalized * normalized;
          }, 0) / dataArray.length
        );
        if (volume > 0.3) handleBlowSuccess();
        else requestAnimationFrame(checkBlow);
      };
      checkBlow();
    } catch (err) { console.warn("Mic blocked", err); }
  };

  const handleBlowSuccess = () => {
    if (isLitinMatiRef.current) return;
    isLitinMatiRef.current = true;
    setIsLitinMati(true);
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setStage("blown"), 2000);
  };

  // --- STYLE KUE (TETAP) ---
  const chocolateShadow = `
    0 2px 0px #614516, 0 4px 0px #412e0e, 0 6px 0px #402d0e, 
    0 8px 0px #3f2d0e, 0 10px 0px #3e2c0e, 0 12px 0px #3d2b0e, 
    0 14px 0px #3c2b0e, 0 16px 0px #3b2a0e, 0 18px 0px #3a2a0e, 
    0 20px 0px #3a290e, 0 22px 0px #39280e, 0 24px 0px #38280e, 
    0 26px 0px #37270e, 0 28px 0px #36270e, 0 30px 0px #35260e
  `;

  return (
<div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      
{/* --- BACKGROUND EFFECTS --- */}
      {/* 1. Brighter Glows */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-purple-600/30 blur-[130px] rounded-full z-0" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-blue-600/30 blur-[130px] rounded-full z-0" />
      
      {/* 2. Stars (Moving & Twinkling) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute bg-white rounded-full animate-star-move"
          style={{
            width: (i % 3 === 0 ? '3px' : '1px'), // Variasi ukuran saja
            height: (i % 3 === 0 ? '3px' : '1px'),
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.5 + 0.2, // Kurangi opacity maksimal
            animationDuration: (Math.random() * 5 + 5) + 's', 
            animationDelay: (Math.random() * 3) + 's',
            // Tambahkan hardware acceleration
            willChange: 'transform', 
          }}
        />
      ))}
      </div>

      {/* --- Bagian Lain Tetap Sama --- */}
      {/* ... sisa kode kue, omnichat, dan kartu ... */}

      <style dangerouslySetInnerHTML={{ __html: `
        /* Animasi Bintang: Gerak pelan ke atas + Kerlip */
        @keyframes starMove {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(-40px) scale(1);
            opacity: 0.3;
          }
        }
        .animate-star-move {
          animation: starMove linear infinite;
        }

        /* Animasi Flicker & Floating (Tetap) */
        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) skewX(5deg); }
          25% { transform: translateX(-50%) skewX(-5deg); }
          50% { transform: translateX(-50%) skewX(10deg); }
          75% { transform: translateX(-50%) skewX(-10deg); }
        }
        .animate-flicker { animation: flicker 0.5s ease-in-out alternate infinite; }
        .omnichat-1, .omnichat-2 { animation: floating1 4s ease-in-out infinite; }
        .omnichat-3, .omnichat-4 { animation: floating2 3s ease-in-out infinite; }

        /* Barisan Acak (Goyang Kiri Kanan saja supaya posisi 'top' manual tidak rusak) */
        .omnichat-5 { 
          animation: floatingSide 4s ease-in-out infinite; 
        }
        .omnichat-6 { 
          animation: floatingSide 3s ease-in-out infinite; 
        }

        @keyframes floatingSide {
          0%, 100% { transform: translateX(0) scaleX(1); }
          50% { transform: translateX(15px) scaleX(1); } 
        }
        @keyframes floating1 { 0%, 100% { top: 10%; } 25% { top: 5%; } 75% { top: 15%; } }
        @keyframes floating2 { 0%, 100% { top: 70%; } 25% { top: 65%; } 75% { top: 75%; } }
      `}} />

      {/* --- KUE (TETAP) --- */}
      <AnimatePresence>
        {stage !== "blown" && (
          <motion.div 
            exit={{ opacity: 0, scale: 0.8 }}
            className="cake relative w-[250px] h-[200px] z-10"
          >
            <div className="plate absolute w-[270px] h-[110px] bottom-[-10px] left-[-10px] bg-[#ccc] rounded-[50%] shadow-[0_2px_0_#b3b3b3,0_4px_0_#b3b3b3,0_5px_40px_rgba(0,0,0,0.5)]" />
            <div className="layer layer-bottom absolute w-[250px] h-[100px] rounded-[50%] bg-[#553c13] top-[66px]" style={{ boxShadow: chocolateShadow }} />
            <div className="layer layer-middle absolute w-[250px] h-[100px] rounded-[50%] bg-[#553c13] top-[33px]" style={{ boxShadow: chocolateShadow }} />
            <div className="layer layer-top absolute w-[250px] h-[100px] rounded-[50%] bg-[#553c13] top-[0px]" style={{ boxShadow: chocolateShadow }} />
            <div className="icing absolute top-[2px] left-[5px] bg-[#f0e4d0] w-[240px] h-[90px] rounded-[50%] after:content-[''] after:absolute after:inset-[4px_5px_6px_5px] after:bg-[#f5ecd9] after:rounded-[50%] after:shadow-[0_0_4px_#fcf8f0,0_0_4px_#fcf8f0,0_0_4px_#fcf8f0] after:z-[1]" />
            <div className="drip drip1 absolute block w-[40px] h-[48px] top-[53px] left-[5px] bg-[#f0e4d0] rounded-b-[25px] skew-y-[15deg]" />
            <div className="drip drip2 absolute block w-[50px] h-[60px] top-[69px] left-[181px] bg-[#f0e4d0] rounded-b-[25px] -skew-y-[15deg]" />
            <div className="drip drip3 absolute block w-[80px] h-[54px] top-[54px] left-[90px] bg-[#f0e4d0] rounded-b-[40px]" />
            {[
              { left: "50%", ml: "-8px" },
              { left: "35%", ml: "-8px" },
              { left: "65%", ml: "-8px" },
              { left: "50%", ml: "-8px", mt: "20px" },
              { left: "50%", ml: "-8px", mt: "40px" } 
            ].map((style, i) => (
              <div key={i} className="candle absolute bg-[#7B020B] w-[16px] h-[50px] rounded-[8px/4px] top-[-20px] z-10" style={{ left: style.left, marginLeft: style.ml }}>
                <div className="before absolute top-0 left-0 w-[16px] h-[8px] rounded-[50%] bg-[#a8030f]" />
                {!isLitinMati && (
                  <div className="flame absolute bg-orange-500 w-[15px] h-[35px] rounded-[10px_10px_10px_10px/25px_25px_10px_10px] top-[-34px] left-3.5 -translate-x-1/2 z-10 shadow-[0_0_10px_rgba(255,165,0,0.5),0_0_20px_rgba(255,165,0,0.5),0_0_60px_rgba(255,165,0,0.5),0_0_80px_rgba(255,165,0,0.5)] origin-[50%_90%] animate-flicker" />
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- OMNICHAT (TETAP) --- */}
      {stage !== "blown" && (
        <>
          {/* TETAP DI BARISAN (Pinggir) */}
          <Omnichat color="#408eff" className="omnichat-1" isLeft sideDistance="5%" /> 
          <Omnichat color="#FB0FFF" className="omnichat-2" sideDistance="5%" /> 
          <Omnichat color="#5eeab6" className="omnichat-3" isLeft bottom sideDistance="8%" /> 
          <Omnichat color="#B6B6B6" className="omnichat-4" bottom sideDistance="8%" /> 

          {/* POSISI ACAK (Tengah & Tidak Sejajar) */}
          {/* Ungu: Agak ke tengah kanan, posisi agak tinggi (35%) */}
          <Omnichat 
            color="#A70FFF" 
            className="omnichat-6" 
            sideDistance="10%" 
            topPos="35%" 
          />
          
          {/* Kuning: Agak ke tengah kiri, posisi agak rendah (55%) */}
          <Omnichat 
            color="#FFFB0F" 
            className="omnichat-5" 
            isLeft 
            sideDistance="15%" 
            topPos="40%" 
          />
        </>
      )}

      {/* --- SURPRISE CARD UPDATED: Frosted Glass & Blur Effect --- */}
      <AnimatePresence>
        {stage === "blown" && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }} 
            animate={{ y: 0, opacity: 1, scale: 1 }}
            // Responsive Wide:
            // Mobile: w-[94%] (hampir full layar)
            // Desktop: max-w-2xl (lebar nyaman untuk teks panjang)
            className="z-50 bg-white/10 backdrop-blur-[40px] 
                      w-[94%] max-w-2xl mx-auto
                      p-8 md:p-10 rounded-[2.5rem] md:rounded-[4rem] 
                      border border-white/20 shadow-2xl text-center 
                      flex flex-col max-h-[85vh] relative" 
          >
            {/* Container Teks + Scrollbar */}
            <div className="custom-scrollbar overflow-y-auto pr-4 mb-8">
              {/* Emoji & Title */}
              <div className="text-5xl md:text-6xl mb-6 drop-shadow-lg">
                {birthdayData.emoji}
              </div>
              
              <h2 className="text-2xl md:text-3xl italic font-extrabold mb-6 bg-linear-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent uppercase tracking-[0.2em]">
                {birthdayData.title}
              </h2>
              
              {/* Pesan: Di lebar 2xl, text-sm/base akan terlihat sangat elegan */}
              <div className="text-white/90 leading-relaxed text-justify font-light text-sm md:text-base text-center px-2 md:px-6">
                {birthdayData.message.map((text, i) => (
                  <p key={i} className="mb-3">
                    {text}
                  </p>
                ))}
              </div>
            </div>
            
            {/* Tombol Wrapper */}
            <div className="mt-auto pt-2 w-full flex justify-center">
              <button 
                onClick={() => navigate(birthdayData.redirectPath)} 
                className="group relative px-8 py-4 bg-white/5 border border-white/20 backdrop-blur-md rounded-full transition-all duration-500 hover:bg-white/20 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              >
                <span className="relative z-10 font-bold tracking-[0.3em] uppercase text-white text-[14px] md:text-[16px]">
                  {birthdayData.buttonText}
                </span>
                {/* Efek kilauan saat hover */}
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-pink-500/30 via-transparent to-blue-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS Animasi Flicker & Floating (TETAP) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes flicker {
          0%, 100% { transform: translateX(-50%) skewX(5deg); }
          25% { transform: translateX(-50%) skewX(-50%); }
          50% { transform: translateX(-50%) skewX(10deg); }
          75% { transform: translateX(-50%) skewX(-10deg); }
        }
        .animate-flicker { animation: flicker 1s ease-in-out alternate infinite; }
        .omnichat-1, .omnichat-2 { animation: floating1 4s ease-in-out infinite; }
        .omnichat-3, .omnichat-4 { animation: floating2 3s ease-in-out infinite; }

        /* Barisan Acak (Goyang Kiri Kanan saja supaya posisi 'top' manual tidak rusak) */
        .omnichat-5 { 
          animation: floatingSide 4s ease-in-out infinite; 
        }
        .omnichat-6 { 
          animation: floatingSide 3s ease-in-out infinite; 
        }

        @keyframes floatingSide {
          0%, 100% { transform: translateX(0) scaleX(1); }
          50% { transform: translateX(15px) scaleX(1); } 
        }
        
        @keyframes floating1 { 
          0%, 100% { top: 10%; } 25% { top: 5%; } 75% { top: 15%; } 
        }
        @keyframes floating2 { 
          0%, 100% { top: 70%; } 25% { top: 65%; } 75% { top: 75%; } 
        }
      `}} />
    </div>
  );
}

  function Omnichat({ color, className, isLeft, sideDistance = "10%", topPos }) {
  // Logika Jarak Responsif: 
  // Jika di desktop pakai sideDistance (misal 15%), 
  // Jika di mobile (layar < 768px), paksa ke pinggir banget (misal 4%) 
  // agar tidak tabrakan dengan kue.
  const responsiveDistance = `calc(${sideDistance} + (100vw < 768px ? -10% : 0%))`; 
  // Tapi lebih aman pakai nilai absolut di mobile lewat style:

  return (
    <div 
      className={`icon-wrapper active fixed z-20 w-[50px] h-[50px] md:w-[60px] md:h-[60px] rounded-[50px_50px_0_50px] cursor-pointer ${className}`}
      style={{ 
        backgroundColor: color, 
        top: topPos || 'auto', 
        // Menggunakan bantuan CSS variable untuk jarak responsif
        left: isLeft ? `var(--side-dist, ${sideDistance})` : 'auto', 
        right: !isLeft ? `var(--side-dist, ${sideDistance})` : 'auto',
        transform: isLeft ? 'scaleX(-1)' : 'none',
        boxShadow: `0 0 25px ${color}, 0 0 50px ${color}44`
      }}
    >
      {/* ... isi icon ... */}
      <div className="absolute w-[6px] h-[6px] rounded-full bg-white top-[14%] left-[20%] scale-[0.85]" />
      <div className="absolute w-[6px] h-[6px] rounded-full bg-white top-[25%] right-[42%]" />
      <div className="absolute w-[18px] h-[10px] bg-white top-[36%] right-[56%] rounded-b-full rotate-[22deg] scale-[0.9]" />
    </div>
  );
}