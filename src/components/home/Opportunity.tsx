"use client";

import { useState } from "react";
import Image from "next/image";
import "./Opportunity.css";

const opportunities = [
  {
    image: "/assets/home/Pre school opportunity.jpg",
    title: "Preschool Franchise",
    content:
      "Join the fastest-growing wave of early childhood education with Caelum. Take advantage of the early childhood education market by offering a top-tier learning space for early childhood development under the banner of curiosity, sensory exploration, and social learning.",
  },
  {
    image: "/assets/home/School Opportunity.jpg",
    title: "School Franchise",
    content:
      "Create a complete K-12 institution with our established franchise model, which provides a complete, high-ROI business opportunity. As a Caelum school franchisee, you benefit from our experience in setting up schools that emphasize holistic education.",
  },
  {
    image: "/assets/home/Teacher's training.jpg",
    title: "Teacher's Upskilling",
    content:
      "Empower educators through training programs designed to foster best practices in teaching. Caelum provides in-depth training programs ranging from student engagement to technology infusion in the classroom.",
  },
  {
    image: "/assets/home/Theatre Workshop.jpg",
    title: "Theatre Workshop",
    content:
      "Through the magic of drama and performance, students can improve their communication skills, emotional intelligence, and self-confidence. Learning is fun, engaging, and deeply impactful with these workshops.",
  },
];

const Opportunity = () => {
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const handleFlip = (index: number) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <div>
      <div className="pt-8 px-6 lg:px-0">
        <h3 className="text-center text-3xl font-bold text-color3 mb-8">
          Opportunity
        </h3>
        <div className="container mx-auto grid md:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-8">
          {opportunities.map((item, index) => (
            <div
              key={index}
              className="relative w-full cursor-pointer overflow-hidden"
              style={{ height: "300px" }}
              onClick={() => handleFlip(index)}
            >
              <div className="card-container w-full h-full perspective-1000">
                <div
                  className={`card w-full h-full relative transition-transform duration-500 transform ${
                    flippedIndex === index ? "rotate-y-180" : ""
                  }`}
                >
                  {/* Front of the card */}
                  <div className="card-front w-full h-full rounded-xl flex items-center justify-center overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute bottom-0 bg-color1 text-color3 text-center py-2 w-full font-bold text-sm lg:text-lg">
                      {item.title}
                    </div>
                  </div>

                  {/* Back of the card with white background and yellow border */}
                  <div className="card-back absolute inset-0 bg-white border-4 border-yellow-500 rounded-xl flex items-center justify-center text-color3 font-semibold text-[9px] md:text-base lg:text-base p-4">
                    <p className="text-center">{item.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 border-b-2 border-color1 mx-auto"></div>
      </div>
    </div>
  );
};

export default Opportunity;
