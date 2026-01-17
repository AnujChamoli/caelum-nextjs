"use client";

import { motion } from "framer-motion";

const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative w-full h-[700px] overflow-hidden">
      {/* 🔹 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      >
        <source src="/assets/home/Homepage Video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Gradient Overlay — just enough to highlight text area */}
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent z-0" />
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay z-0" />

      {/* 🔹 Text Section — right side, left-aligned, compact width */}
      <div className="relative z-10 flex items-center justify-end h-full px-8 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-[380px] flex flex-col justify-center gap-4 text-left"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-white leading-snug drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]">
            Reimagining Education:{" "}
            <span className="text-color1">Where Curiosity Meets Growth</span>
          </h2>

          <p className="text-lg lg:text-xl text-white/90 leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            Nurturing Young Minds, Building Lasting Success — The Future of
            Education, Today.
          </p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            onClick={() => scrollToSection("underlying-magic")}
            className="text-lg lg:text-xl font-semibold text-color3 bg-color1 py-2 px-6 rounded-lg w-fit
            hover:scale-105 hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-300"
          >
            What Makes Us Different
          </motion.button>
        </motion.div>
      </div>

      {/* 🔹 Mobile View */}
      <div className="flex flex-col items-center justify-center text-center py-12 px-6 lg:hidden bg-gradient-to-b from-color3/90 to-color9/80 text-white">
        <h2 className="text-3xl font-bold leading-tight">
          Reimagining Education:{" "}
          <span className="text-color1">Where Curiosity Meets Growth</span>
        </h2>
        <p className="mt-4 text-lg text-white/90">
          Nurturing Young Minds. Building Lasting Success.
        </p>
        <button 
          onClick={() => scrollToSection("underlying-magic")}
          className="mt-6 text-lg font-semibold bg-color1 text-color3 px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300">
          What Makes Us Different
        </button>
      </div>
    </section>
  );
};

export default Hero;
