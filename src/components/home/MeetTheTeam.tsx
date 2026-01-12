"use client";

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
    <section className="bg-white py-6">
      <div className="px-6 lg:px-0 max-w-7xl mx-auto">
        {/* Heading */}
        <h3 className="text-center text-4xl font-bold tracking-tight text-color3 mb-10">
          Meet the Team
        </h3>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="group flex flex-col rounded-2xl overflow-hidden bg-white 
              shadow-[0_20px_50px_rgba(255,193,7,0.15),0_30px_80px_rgba(0,0,0,0.06)]
              hover:shadow-[0_30px_90px_rgba(255,193,7,0.25),0_50px_120px_rgba(0,0,0,0.12)]
              transition-all duration-500"
            >
              {/* Image */}
              <div className="relative w-full h-56 lg:h-96 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${member.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/40 via-yellow-700/10 to-transparent" />
              </div>

              {/* Name & Designation */}
              <div className="bg-white text-center px-4 py-6 relative">
                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400" />
                <h4 className="text-lg font-semibold text-color3 tracking-tight">
                  {member.name}
                </h4>
                <p className="mt-1 text-sm text-gray-600 leading-snug">
                  {member.designation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Text */}
        <div className="max-w-7xl mx-auto mt-16 text-center">
          <p className="text-lg text-gray-700 leading-relaxed">
            Caelum&apos;s leadership team is made up of visionaries who are
            passionate about redefining education. With decades of combined
            experience in education management, psychology, curriculum design,
            and school operations, our team brings expertise, innovation, and a
            relentless commitment to excellence.
          </p>

          <p className="mt-6 text-lg text-gray-700 leading-relaxed">
            Caelum people are visionaries, inventors, and changemakers guided by a
            common mission: educational experiences that have a transformative
            effect on students&apos; lives and their communities.
          </p>
        </div>

        {/* Divider */}
        <div className="mt-20 border-b-2 border-color1 opacity-80 shadow-[0_0_12px_rgba(255,193,7,0.35)]" />
      </div>
    </section>
  );
};

export default MeetTheTeam;
