"use client";

import Image from "next/image";

const teamMembers = [
  {
    name: "Mahit Thadaney",
    designation: "Founder, CEO",
    image: "/assets/home/MrMahitThadaney.png",
  },
  {
    name: "Jayani Thadaney",
    designation: "Director - Teacher Development and AI Pedagogy",
    image: "/assets/home/Ms.Jayani.png",
  },
  {
    name: "Monica Thadaney",
    designation: "Chief Learning Architect",
    image: "/assets/home/MrsMonicaThadaney.png",
  },
  {
    name: "Harish Thadaney",
    designation: "Chief Strategic Advisor",
    image: "/assets/home/MrHarishThadaney.png",
  },
];

const MeetTheTeam = () => {
  return (
    <section className="bg-white py-12 lg:py-8">
      <div className="px-6 lg:px-0 max-w-7xl mx-auto">
        {/* Heading */}
        <h3 className="text-center text-4xl font-bold tracking-tight text-gray-800 mb-14">
          Meet the Team
        </h3>

        {/* Grid Container */}
        <div className="flex flex-wrap justify-center gap-10 lg:gap-12">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group flex flex-col
              w-[90%] sm:w-[45%] md:w-[30%] lg:w-[26%] xl:w-[22%]
              rounded-2xl overflow-hidden bg-white
              shadow-[0_12px_40px_rgba(0,0,0,0.06)]
              hover:shadow-[0_24px_70px_rgba(0,0,0,0.12)]
              transition-all duration-500 ease-out
              border border-gray-100 hover:border-yellow-400/50"
            >
              {/* Image */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[420px] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority={index < 2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-40 group-hover:opacity-20 transition-opacity duration-500" />
              </div>

              {/* Info */}
              <div className="bg-white text-center px-6 py-8 relative">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 rounded-full" />

                <h4 className="text-xl font-semibold text-gray-800 tracking-tight group-hover:text-yellow-600 transition-colors duration-300">
                  {member.name}
                </h4>

                <p className="mt-3 text-base text-gray-600 leading-snug max-w-xs mx-auto">
                  {member.designation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="max-w-7xl mx-auto mt-20 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Caelum&apos;s leadership team is made up of visionaries who are
            passionate about redefining education. With decades of combined
            experience in education management, psychology, curriculum design,
            and school operations, our team brings expertise, innovation, and a
            relentless commitment to excellence.
          </p>

          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            Caelum people are visionaries, inventors, and changemakers guided by
            a common mission — educational experiences that have a transformative
            effect on students&apos; lives and their communities.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-24 border-b-2 border-color1"></div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
