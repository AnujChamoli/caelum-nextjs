"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Awards = () => {
  const awardsList = Array(6).fill("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateMobileView = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    updateMobileView();
    window.addEventListener("resize", updateMobileView);
    return () => {
      window.removeEventListener("resize", updateMobileView);
    };
  }, []);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex + (isMobile ? 1 : 2) >= (isMobile ? 3 : awardsList.length)
        ? 0
        : prevIndex + (isMobile ? 1 : 2)
    );
  }, [isMobile, awardsList.length]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? isMobile
          ? 2
          : awardsList.length - (isMobile ? 1 : 2)
        : prevIndex - (isMobile ? 1 : 2)
    );
  }, [isMobile, awardsList.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [handleNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
  };

  return (
    <div>
      <div className="pt-4 px-6 lg:px-0">
        <h3 className="text-center text-[29px] lg:text-3xl font-bold text-color3 mb-6 lg:mb-4">
          Awards & Recognition
        </h3>
        <p className="text-center text-color3 mt-8">
          Over the years, Caelum has become known for breaking the mold in how
          education is perceived. From our curriculum design which has been
          recognized on a national scale to innovation awards in school
          infrastructures, Caelum&apos;s dedicated efforts have seen recognition
          from key educational bodies in the country. Our growing list of
          recognitions is a testament to our pursuit of excellence and our role
          in the field. These recognitions give more assurance to the investors
          that they are joining a reputable, high-performing brand.
        </p>
        <br />
        <div className="container mx-auto">
          <div className="flex justify-center px-4 lg:px-20 gap-8 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              {awardsList
                .slice(currentIndex, currentIndex + (isMobile ? 1 : 1))
                .map((_, index) => (
                  <motion.div
                    key={index}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="enter"
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    className="w-full lg:w-1/2 h-60 rounded-lg bg-contain bg-center bg-no-repeat"
                    style={{
                      backgroundImage: `url(/assets/home/Awards.png)`,
                    }}
                  />
                ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center mt-6">
            {/* <button onClick={handlePrev} className="text-color10 text-2xl mr-4">
              <FaArrowLeft />
            </button>

            <div className="flex space-x-2">
              {Array.from({
                length: Math.ceil(
                  (isMobile ? 3 : awardsList.length) / (isMobile ? 1 : 2)
                ),
              }).map((_, index) => (
                <span
                  key={index}
                  className={`h-3 w-3 rounded-full ${
                    index === Math.floor(currentIndex / (isMobile ? 1 : 2))
                      ? "bg-black"
                      : "bg-gray-300"
                  }`}
                ></span>
              ))}
            </div>

            <button onClick={handleNext} className="text-color10 text-2xl ml-4">
              <FaArrowRight />
            </button> */}
          </div>
        </div>
        <div className="mt-12 border-b-2 border-color1"></div>
      </div>
    </div>
  );
};

export default Awards;
