import { useNavigate } from "react-router-dom";
import NeuralBackground from "../components/NeuralBackground";
import { DescMenu } from "../data/data";


export default function Menu() {
  const navigate = useNavigate();

  const handleStart = () => {
    // 1. Trigger Audio: Mencoba memutar audio kosong/singkat 
    // atau sekadar 'pancingan' agar browser mengizinkan audio berikutnya.
    const pingAudio = new Audio();
    pingAudio.play().catch(() => {}); 

    // 2. Pindah Halaman
    navigate("/puzzle-1");
  };

  return (
    <div className="relative h-screen w-full flex items-center justify-center text-white overflow-hidden">
      <NeuralBackground allowClick={false}/>

      <div className="z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-10 tracking-tight 
               drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] 
               bg-linear-to-b from-white via-white to-white/30 
               bg-clip-text text-transparent 
               py-2 leading-tight">
          Something for You
        </h1>

        <button 
          onClick={handleStart} 
          className="group relative px-10 py-4 bg-white/5 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <span className="relative z-10 font-bold tracking-[0.3em] uppercase text-xl">
            Let's Start
          </span>
          <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </button>

        <div className="mt-6 flex flex-col items-center relative">
          {/* 2. Container Teks dengan Lebar Proporsional */}
          <div className="max-w-sm md:max-w-xl p-6 relative bg-white/5 border border-white/20 rounded-md">

            <p className="text-center text-gray-500 
                          text-[10px] md:text-[12px] 
                          font-semibold tracking-wide leading-8 uppercase 
                          drop-shadow-[0_0_12px_rgba(255,255,255,0.05)]
                          transition-all duration-1000 hover:text-white hover:tracking-widest">
              {DescMenu.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}