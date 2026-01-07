import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link"; // Не забудь про імпорт Link

const PackagingScroll = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // --- ЛОГІКА АНІМАЦІЙ (Без змін) ---
  const alumOpacity = useTransform(scrollYProgress, [0.25, 0.3], [1, 0]);
  const alumScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const alumTextX = useTransform(scrollYProgress, [0.25, 0.3], ["0%", "-50%"]);

  const pvcOpacity = useTransform(scrollYProgress, [0.3, 0.35, 0.6, 0.65], [0, 1, 1, 0]);
  const pvcScale = useTransform(scrollYProgress, [0.3, 0.4], [1.1, 1]);
  const pvcTextY = useTransform(scrollYProgress, [0.3, 0.35, 0.6, 0.65], ["50px", "0px", "0px", "-50px"]);

  const parchOpacity = useTransform(scrollYProgress, [0.65, 0.7], [0, 1]);
  const parchScale = useTransform(scrollYProgress, [0.65, 0.75], [0.9, 1]);
  const parchTextX = useTransform(scrollYProgress, [0.65, 0.75], ["50px", "0px"]);

  return (
    // ЗМІНА 1: Фон тепер білий (bg-white), текст темний (text-neutral-900)
    <div ref={containerRef} className="relative z-0 h-[400vh] bg-gray-100 text-neutral-900">
      
      {/* Sticky контейнер з відступом зверху (pt-24), щоб не налазити на хедер */}
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden px-4 md:px-12">
        
        <div className="flex h-full w-full max-w-7xl flex-row items-center gap-8">
          
          {/* --- ЛІВА КОЛОНКА (КАРТИНКИ) --- */}
          {/* ЗМІНА 2: Рамка світла, тінь м'якша, фон картки світло-сірий */}
          <div className="relative flex h-[70vh] w-3/5 items-center justify-center overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-200 shadow-2xl">
            
            {/* АЛЮМІНІЙ */}
            <motion.div style={{ opacity: alumOpacity, scale: alumScale }} className="absolute inset-0 h-full w-full">
              <img 
                src="https://placehold.co/800x1200/e2e8f0/1e293b?text=Aluminum+Foil" 
                alt="Aluminum" 
                className="h-full w-full object-cover mix-blend-darken" // mix-blend допоможе краще вписати картинку
              />
            </motion.div>

            {/* PVC */}
            <motion.div style={{ opacity: pvcOpacity, scale: pvcScale }} className="absolute inset-0 h-full w-full">
              <img 
                src="https://placehold.co/800x1200/fce7f3/db2777?text=PVC+Wrap" 
                alt="PVC" 
                className="h-full w-full object-cover mix-blend-darken"
              />
            </motion.div>

            {/* ПЕРГАМЕНТ */}
            <motion.div style={{ opacity: parchOpacity, scale: parchScale }} className="absolute inset-0 h-full w-full">
              <img 
                src="https://placehold.co/800x1200/ffedd5/c2410c?text=Parchment" 
                alt="Parchment" 
                className="h-full w-full object-cover mix-blend-darken"
              />
            </motion.div>
          </div>


          {/* --- ПРАВА КОЛОНКА (ТЕКСТ) --- */}
          <div className="relative flex h-[50vh] w-2/5 flex-col justify-center px-6">
            
            {/* АЛЮМІНІЙ */}
            <motion.div style={{ opacity: alumOpacity, x: alumTextX }} className="absolute w-full">
              {/* Темний заголовок */}
              <h2 className="mb-4 text-5xl font-black uppercase tracking-tighter text-neutral-900 lg:text-6xl">
                Aluminum <br/> <span className="text-neutral-400">Foil</span>
              </h2>
              <p className="mb-8 text-lg text-neutral-600 font-medium leading-relaxed">
                Premium grade aluminum. Perfect for professional kitchen use and heavy-duty wrapping.
              </p>
              {/* Кнопка тепер темна, щоб виділятися на білому фоні */}
              <CtaButton text="Calculate Aluminum" color="bg-neutral-900 text-white hover:bg-neutral-700 shadow-xl shadow-neutral-900/20" />
            </motion.div>

            {/* PVC */}
            <motion.div style={{ opacity: pvcOpacity, y: pvcTextY }} className="absolute w-full">
              <h2 className="mb-4 text-5xl font-black uppercase tracking-tighter text-neutral-900 lg:text-6xl">
                PVC <br/> <span className="text-pink-500">Cling Wrap</span>
              </h2>
              <p className="mb-8 text-lg text-neutral-600 font-medium leading-relaxed">
                Super elastic and sticky. Keeps your food fresh for longer with advanced polymer tech.
              </p>
              <CtaButton text="Calculate PVC" color="bg-pink-600 text-white hover:bg-pink-500 shadow-xl shadow-pink-600/20" />
            </motion.div>

            {/* ПЕРГАМЕНТ */}
            <motion.div style={{ opacity: parchOpacity, x: parchTextX }} className="absolute w-full">
              <h2 className="mb-4 text-5xl font-black uppercase tracking-tighter text-neutral-900 lg:text-6xl">
                Baking <br/> <span className="text-amber-500">Parchment</span>
              </h2>
              <p className="mb-8 text-lg text-neutral-600 font-medium leading-relaxed">
                Non-stick silicone coating. Heat resistant up to 220°C. The baker's choice.
              </p>
              <CtaButton text="Calculate Parchment" color="bg-amber-600 text-white hover:bg-amber-500 shadow-xl shadow-amber-600/20" />
            </motion.div>

          </div>
        </div>
        
        {/* Скрол індикатор теж темний */}
        <div className="absolute bottom-6 animate-bounce text-xs font-bold uppercase tracking-widest text-neutral-400">
            ↓ Scroll Down
        </div>

      </div>
    </div>
  );
};

// Кнопка
const CtaButton = ({ text, color }: { text: string, color: string }) => (
  <Link 
    href="/create-calculation" 
    className={`inline-flex items-center gap-3 rounded-full px-8 py-4 text-lg font-bold transition-all duration-300 hover:scale-105 ${color}`}
  >
    {text}
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  </Link>
);

export default PackagingScroll;