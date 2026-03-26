import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { puzzleData } from "../data/puzzles";
import NeuralBackground from "../components/NeuralBackground";

export default function PuzzlePage({ levelIndex }) {
  const data = puzzleData[levelIndex];
  const navigate = useNavigate();
  
  const size = 3; 
  const [pieces, setPieces] = useState([]);
  const [isSolved, setIsSolved] = useState(false);
  const [draggedIdx, setDraggedIdx] = useState(null);

  // Inisialisasi Puzzle: Acak posisi
  useEffect(() => {
    const initial = Array.from({ length: size * size }, (_, i) => i);
    const shuffled = [...initial].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setIsSolved(false);
  }, [levelIndex]);

  // Logika Swap (Tukar Posisi)
  const handleSwap = (targetIdx) => {
    if (draggedIdx === null || isSolved) return;

    const newPieces = [...pieces];
    const temp = newPieces[draggedIdx];
    newPieces[draggedIdx] = newPieces[targetIdx];
    newPieces[targetIdx] = temp;

    setPieces(newPieces);
    setDraggedIdx(null);

    // Cek Kemenangan
    if (newPieces.every((p, i) => p === i)) {
      setIsSolved(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden text-white"
    >
      <NeuralBackground allowClick={false} />

      <div className="z-10 flex flex-col items-center p-4 py-10 h-full overflow-y-auto">
        <h2 className="text-2xl font-light mb-2 tracking-widest uppercase opacity-60">
          Level {levelIndex + 1}
        </h2>
        <p className="text-sm mb-6 opacity-40 italic font-light">
          Tukar posisi kotak untuk menyusun foto
        </p>

        {/* Grid Puzzle */}
        <div 
          className="grid gap-1 bg-white/5 p-2 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl"
          style={{ 
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            width: 'min(90vw, 420px)',
            height: 'min(90vw, 420px)' 
          }}
        >
          {pieces.map((piece, index) => (
            <motion.div
              key={`${levelIndex}-${piece}`}
              layout // Efek sliding halus saat tukar posisi
              draggable
              onDragStart={() => setDraggedIdx(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleSwap(index)}
              className="relative cursor-grab active:cursor-grabbing rounded-sm overflow-hidden border border-white/5 hover:border-cyan-400/50 transition-colors duration-300"
              style={{
                backgroundImage: `url(${data.image})`,
                backgroundSize: `${size * 100}% ${size * 100}%`,
                backgroundPosition: `${(piece % size) * (100 / (size - 1))}% ${Math.floor(piece / size) * (100 / (size - 1))}%`
              }}
              whileHover={{ scale: 1.02, zIndex: 20 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        {/* Modal Deskripsi Muncul Saat Selesai */}
        {/* Modal Deskripsi Muncul Saat Selesai */}
        {/* Modal Deskripsi Muncul Saat Selesai */}
        <AnimatePresence>
          {isSolved && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              // Responsive Classes: w-[90%] untuk mobile, max-w-md untuk desktop
              className="mt-6 mx-auto w-[90%] max-w-md bg-white/5 p-5 md:p-8 rounded-4xl backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center max-h-[80vh]"
            >
              {/* Judul: shrink-0 agar tidak mengecil */}
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-white shrink-0 tracking-tighter uppercase text-center">
                {data.title}
              </h3>

              {/* Kontainer Teks: overflow-y-auto adalah kunci responsivitas teks panjang */}
              <div className="overflow-y-auto w-full pr-1 mb-6 custom-scrollbar text-center">
                <p className="text-white/70 leading-relaxed text-sm md:text-base font-light whitespace-pre-line">
                  {data.description}
                </p>
              </div>

              {/* Tombol: shrink-0 agar tidak terpotong saat layar sempit */}
              <button 
                onClick={() => navigate(data.nextPath)}
                className="group relative px-8 py-3 bg-white/5 border border-white/20 backdrop-blur-md rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] shrink-0"
              >
                <span className="relative z-10 font-medium tracking-widest uppercase text-white text-[14px] md:text-[18px]">
                  {levelIndex === puzzleData.length - 1 ? "Check the Suprise" : "Next Puzzle"}
                </span>
                
                <div className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}