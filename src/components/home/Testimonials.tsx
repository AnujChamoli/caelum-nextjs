"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { ImQuotesLeft, ImQuotesRight } from "react-icons/im";
import { motion, AnimatePresence } from "framer-motion";

const Testimonials = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials = [
    {
      name: "Kyle and Zayne Nariman's Parents",
      text:
        "Our experience with Caelum High School has far exceeded our expectations. The dedicated educators, comprehensive curriculum, and nurturing environment have greatly contributed to our children's growth. The school's commitment to academic excellence and character development is truly commendable, leaving a positive impact on our children's education and overall development.",
    },
    {
      name: "Reia Rathod's Father",
      text:
        "Caelum High School's commitment to holistic student development is commendable. Expert staff fosters a nurturing learning environment. State-of-the-art facilities encourage potential exploration. Well-organized extracurriculars like annual events provide diverse opportunities for skill growth. The holistic approach nurtures capable, confident individuals, excelling academically and embracing the future.",
    },
    {
      name: "Sarrah Dhariwal's Father",
      text:
        "Our daughter Sarrah, part of Caelum High since preschool, has grown from toddler to confident teen with equal opportunities in academics and extracurriculars. Caelum's shaping of her character fuels her strides into high school, embodying the school's legacy. Our appreciation knows no bounds.",
    },
    {
      name: "Mannan & Ryka Marhatta's Father",
      text:
        "Caelum High is a wonderful school; we admitted our elder one first, and over the years saw brilliant nurturing for his future. So, admitting the younger one was an easy choice. Caelum truly lives its happy school ideology, providing equal opportunities for academics and holistic development. Certainly the best school!",
    },
    {
      name: "Yash and Chintan Dhoka's Parents",
      text:
        "Our kids enjoyed their schooling. Thanks to '#thehappyschool'. Perfect harmony of hardware (school infrastructure) and software (school teachers) to help groom children into respectable human beings.",
    },
  ];

  /* ---------------- Responsive ---------------- */
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 1024);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const step = isMobile ? 1 : 2;
  const totalPages = Math.ceil(testimonials.length / step);
  const currentIndex = pageIndex * step;

  /* ---------------- Navigation ---------------- */
  const handleNext = useCallback(() => {
    setDirection(1);
    setPageIndex((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setPageIndex((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  /* ---------------- Autoplay ---------------- */
  useEffect(() => {
    if (isPaused) return;

    intervalRef.current = setInterval(handleNext, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [handleNext, isPaused]);

  /* ---------------- Animation ---------------- */
  const cardVariants = {
    hidden: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 80 : -80,
      scale: 0.96,
    }),
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 80, damping: 22 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction < 0 ? 80 : -80,
      scale: 0.96,
      transition: { duration: 0.35 },
    }),
  };

  return (
    <div className="py-10 px-6 lg:px-0">
      <h3 className="text-center text-3xl font-bold text-color3 mb-12">
        Parents&apos; Testimonies
      </h3>

      <div className="container mx-auto relative flex flex-col items-center">
        <div className="flex flex-wrap justify-center gap-8 min-h-[420px] w-full">
          <AnimatePresence custom={direction} mode="wait">
            {testimonials
              .slice(currentIndex, currentIndex + step)
              .map((testimonial, i) => {
                const isHovered = hoveredIndex === i;

                return (
                  <motion.div
                    key={`${testimonial.name}-${pageIndex}-${i}`}
                    custom={direction}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onMouseEnter={() => {
                      setIsPaused(true);
                      setHoveredIndex(i);
                    }}
                    onMouseLeave={() => {
                      setIsPaused(false);
                      setHoveredIndex(null);
                    }}
                    className={`
                      w-[340px] lg:w-[480px]
                      bg-white rounded-xl p-8
                      flex flex-col justify-between
                      border transition-all duration-300 ease-out
                      ${
                        hoveredIndex !== null && !isHovered
                          ? "opacity-60"
                          : "opacity-100"
                      }
                      ${
                        isHovered
                          ? "shadow-2xl border-yellow-400/60 -translate-y-1"
                          : "shadow-lg border-gray-200"
                      }
                    `}
                  >
                    <p className="text-gray-700 italic text-[16px] leading-[1.7] tracking-tight relative">
                      <span className="absolute -top-4 -left-4 text-yellow-500 text-3xl opacity-80">
                        <ImQuotesLeft />
                      </span>

                      <span className="block px-4 pt-3 pb-2 text-justify">
                        {testimonial.text}
                      </span>

                      <span className="absolute -bottom-4 right-2 text-yellow-500 text-3xl opacity-80">
                        <ImQuotesRight />
                      </span>
                    </p>

                    <h4 className="text-lg font-semibold text-gray-900 mt-6 text-center">
                      {testimonial.name}
                    </h4>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center mt-10">
          <button
            onClick={() => {
              setIsPaused(true);
              handlePrev();
            }}
            className="text-color10 text-2xl mr-4 hover:text-gray-700 transition-all"
            aria-label="Previous testimonials"
          >
            <FaArrowLeft />
          </button>

          <div className="flex space-x-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <span
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === pageIndex
                    ? "bg-black scale-110"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsPaused(true);
              handleNext();
            }}
            className="text-color10 text-2xl ml-4 hover:text-gray-700 transition-all"
            aria-label="Next testimonials"
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
