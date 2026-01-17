"use client";

import { useState } from "react";
import Image from "next/image";
import Modal from "./Modal";

const AboutUs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const aboutUsContent = [
    "Caelum has pioneered a new era of education where each child's unique potential is at the center of everything we do. We go beyond traditional teaching, emphasizing creativity, critical thinking, and emotional intelligence in a safe and open environment. Our approach focuses on the holistic development of children while offering a scalable, profitable model for our franchisees and investors. There is much attention to detail with our aim at inspiring curiosity, inculcating independence, and developing skills that prepare children for the future.",
    "With a pioneering child-centric philosophy and proven operational support, Caelum schools provide a premium educational experience that meets the evolving needs of modern families, warranting success. We recognize the ever-growing demand for quality education and intend to capture market share within one of the world's fastest-growing sectors.",
    "Founded on the belief that education must evolve with societal shifts, Caelum offers a progressive learning model that merges global best practices with localized insights and maintains its relevance and impact. Cutting-edge curriculum and personalized guidance are offered to graduate and see individuals who are academically competent, emotionally resilient, and socially conscious.",
  ];
  return (
    <div>
      <section id="about-us" className="pt-8 px-6 lg:px-0">
        <div className="container mx-auto flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2">
            <Image
              className="bg-color6 h-64 md:h-[450px] lg:h-[540px] w-full object-cover"
              src="/assets/home/About Us.jpg"
              alt="About Us"
              width={600}
              height={540}
            />
          </div>

          <div className="w-full text-center lg:text-left lg:w-1/2 mt-6 lg:mt-0 lg:ml-12">
            <h2 className="text-3xl font-bold text-color3 mb-4">About Us</h2>
            <p className="text-color3 mb-6 text-lg text-left">
              {aboutUsContent[0]}
            </p>
            <button
              className="bg-color1 text-color3 px-8 py-2 lg:px-12 rounded-lg font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              Read More
            </button>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="About Us"
          content={aboutUsContent}
        />
        <div className="mt-14 border-b-2 border-color1"></div>
      </section>
    </div>
  );
};

export default AboutUs;
