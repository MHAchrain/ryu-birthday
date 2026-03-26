import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from "canvas-confetti";

export default function FinalPage() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("idle");

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setResult("Sedang mengirim pesanmu...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "d44c2995-96d2-478f-a213-2aeab2768205");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setResult("Pesan terkirim! Terima kasih ya ✨");
        // Tambahkan Selebrasi Kecil saat Berhasil
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
        event.target.reset();
      } else {
        setStatus("error");
        setResult("Waduh, ada masalah. Coba lagi ya?");
      }
    } catch (error) {
      setStatus("error");
      setResult("Koneksi terputus.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-2 md:p-6 bg-[#0a0a0a] overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/15 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-600/15 blur-[140px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        // Card digedein ke max-w-3xl (768px)
        // Padding dikurangi (p-6 di mobile, p-12 di desktop)
        className="z-10 w-full max-w-3xl bg-white/10 backdrop-blur-[40px] 
                   p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] 
                   border border-white/20 shadow-2xl flex flex-col"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-4xl font-black bg-linear-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent uppercase tracking-[0.3em] mb-3">
            Kesan dan Pesan
          </h2>
          <p className="text-white/50 text-[16px] md:text-[18px] font-light italic tracking-widest">
            Kasih kesan, pendapat, pesan, apapun itu buat Rayen
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* Input Nama */}
          <input 
            type="text" 
            name="name" 
            placeholder="Dari Siapa Nih!?"
            required
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-blue-400/40 transition-all duration-300"
          />

          {/* Textarea Pesan (Area Utama yang digedein) */}
          <textarea 
            name="message" 
            placeholder="Tulis apapun yang ingin kamu sampaikan..."
            required
            rows="8" // Baris ditambah agar area ketik lebih luas
            className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-400/40 transition-all duration-300 resize-none custom-scrollbar text-sm md:text-base leading-relaxed"
          ></textarea>

          {/* Footer Form */}
          <div className="flex flex-col items-center gap-4 mt-2">
            <button 
              type="submit" 
              disabled={status === "sending" || status === "success"}
              className="group relative w-full md:w-auto px-16 py-4 bg-white/5 border border-white/20 backdrop-blur-md rounded-full transition-all duration-500 hover:bg-white/15 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <span className="relative z-10 font-bold tracking-[0.4em] uppercase text-white text-[10px] md:text-xs">
                {status === "sending" ? "Sending..." : "Send Message"}
              </span>
              <div className="absolute inset-0 rounded-full bg-linear-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Status Message */}
            <AnimatePresence>
              {result && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-[10px] md:text-xs font-medium uppercase tracking-widest ${
                    status === "success" ? "text-cyan-400" : status === "error" ? "text-red-400" : "text-white/30"
                  }`}
                >
                  {result}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </motion.div>
    </div>
  );
}