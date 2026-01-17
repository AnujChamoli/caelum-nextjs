"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const scaleVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-color5 via-color2 to-color5 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="fixed top-20 left-10 w-40 h-40 bg-color1/15 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
      />
      <motion.div
        className="fixed bottom-20 right-10 w-56 h-56 bg-color7/15 rounded-full blur-3xl"
        variants={floatingVariants}
        animate="animate"
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="w-full flex flex-col items-center justify-center relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Animated Icon */}
        <motion.div
          className="mb-8 sm:mb-12"
          variants={floatingVariants}
          animate="animate"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-color1 to-color7 rounded-full shadow-2xl">
            <span className="text-6xl sm:text-7xl">🚀</span>
          </div>
        </motion.div>

        {/* Coming Soon - Large */}
        <motion.div
          className="text-center mb-6 sm:mb-8"
          variants={itemVariants}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-color1 to-color7 text-color3 px-8 sm:px-12 py-4 sm:py-6 rounded-2xl font-black text-4xl sm:text-6xl lg:text-7xl shadow-xl"
            variants={scaleVariants}
            animate="animate"
          >
            Coming Soon
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-4xl lg:text-5xl font-bold text-color3 mb-4 sm:mb-6 text-center"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-gray-600 text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 leading-relaxed max-w-3xl text-center px-4"
          variants={itemVariants}
        >
          {description}
        </motion.p>

        {/* Back to Home */}
        <motion.div variants={itemVariants}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-color1 font-bold hover:text-color7 transition text-base sm:text-lg mt-6 sm:mt-8"
          >
            ← Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

