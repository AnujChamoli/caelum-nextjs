"use client";

import { useState } from "react";

const UnderlyingMagic = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const caelumWayContent = [
    "The Caelum Way is a commitment to changing education. We believe that every child deserves nurturing support and recognition of their talents and interests so that they can be strong in all those areas. Our approach integrates high academic standards with emotional and social development so that students are prepared not only for the academic challenges that lie ahead but for life itself.",
    "The Caelum Way positions children at the heart of their learning journey, empowering them to be curious, confident, and creative thinkers. Through our schools, we hope to help foster leaders, innovators, and compassionate citizens who will shape a better tomorrow.",
    "Creating an ecosystem for children to grow is what the Caelum Way is about, but it's also a proven business model with scalability and results. The curriculum design, infrastructure setting, marketing, and even operational support are all turnkey solutions that enable our franchisees to concentrate on delivering quality education and driving growth. With a strong brand, all-round support, and an innovative approach to education, the Caelum Way guarantees high profitability and long-term success for investors.",
  ];

  return (
    <section id="underlying-magic" className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-20 py-24">

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-20 items-center">

          {/* LEFT TEXT */}
          <div className="space-y-8">
            <p className="text-[17px] leading-[1.9] text-color3 max-w-xl">
              {caelumWayContent[0]}
            </p>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center bg-color1 text-color3 px-10 py-3 rounded-xl font-semibold text-base shadow-md hover:shadow-lg transition"
            >
              Read More
            </button>
          </div>

          {/* RIGHT BRAND BLOCK */}
          <div className="flex flex-col justify-center">
            <h3 className="text-[46px] leading-tight font-bold text-color3">
              The Caelum Way
            </h3>

            <h4 className="text-[32px] italic text-color3 mt-6 tracking-wide">
              Underlying Magic
            </h4>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-24 border-b-2 border-color1"></div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-10 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-color3 mb-6">
              The Caelum Way – Underlying Magic
            </h2>

            {caelumWayContent.map((content, index) => (
              <p key={index} className="text-color3 mb-4 leading-relaxed">
                {content}
              </p>
            ))}

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-color1 text-color3 px-8 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UnderlyingMagic;
