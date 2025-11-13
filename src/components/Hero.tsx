"use client";

import { heroBg } from "@/assets/images";
import Image from "next/image";
import React from "react";
import { FiFolder, FiMail } from "react-icons/fi";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative h-[90vh] sm:h-[80vh] md:h-[90vh] scroll-smooth overflow-hidden"
    >
      {/* Background Image */}
      <Image
        src={heroBg}
        alt="Hero background"
        fill
        className="object-cover"
        priority
        quality={90}
      />

      <style>{`
        /* animated gradient for text */
        @keyframes gradientShift {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }

        /* soft glowing pulse behind text */
        @keyframes glowPulse {
          0% { opacity: 0.15; transform: scale(1) }
          50% { opacity: 0.5; transform: scale(1.05) }
          100% { opacity: 0.15; transform: scale(1) }
        }

        .animate-gradient {
          background: linear-gradient(90deg, #ff8aa4, #82181A, #ffd86b);
          background-size: 200% 200%;
          animation: gradientShift 6s linear infinite;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .text-glow {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(70rem, 95%);
          height: 3.6rem;
          border-radius: 12px;
          background: radial-gradient(closest-side, rgba(255,200,170,0.24), rgba(130,24,26,0.06));
          filter: blur(18px);
          z-index: -1;
          animation: glowPulse 3.6s ease-in-out infinite;
          pointer-events: none;
        }

        /* Reduce heavy animations on small screens */
        @media (max-width: 640px) {
          .animate-gradient { animation: none; background-size: auto; }
          .text-glow { display: none; }
        }
      `}</style>

      {/* decorative subtle overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-0 pointer-events-none" />

      <div className="relative z-20 lg:translate-y-20 flex flex-col items-center translate-y-20 justify-center h-full text-center text-gray-100 px-4">
        <h1 className="relative inline-block font-extrabold leading-tight max-w-[1100px]">
          <div className="text-glow" aria-hidden />
          <span className="block text-5xl text-left sm:text-6xl md:text-5xl lg:text-7xl xl:text-7xl tracking-tight px-2">
            <span className="inline-block text-white">Hi, I'm</span>
            <span className="ml-2 inline-block text-6xl lg:text-7xl  text-[#ff9900]">
              Zayed Uddin
            </span>
          </span>

          {/* subtitle: hidden on very small screens to keep layout compact */}
          <span className="mt-3 block text-sm sm:text-base md:text-lg text-white max-w-2xl mx-auto px-2 text-left lg:text-center sm:block">
            UI/UX designer & front-end developer — crafting focused experiences
            and beautiful interfaces.
          </span>
        </h1>

        {/* CTAs: side-by-side on all sizes, compact on very small screens */}
        <div className="mt-6 sm:mt-10 flex w-full max-w-3xl gap-3 items-stretch justify-center flex-row flex-wrap">
          <a
            href="#portfolio"
            className="flex-1 min-w-[44%] max-w-[48%] sm:min-w-0 sm:max-w-[280px] flex items-center gap-3 bg-white/6 backdrop-blur-sm border border-white/8 p-3 rounded-lg hover:bg-white/10 transition transform hover:-translate-y-0.5"
            aria-label="Open portfolio"
          >
            <div className="flex-shrink-0 rounded-md text-[#fffaf9] bg-[#82181A] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <FiFolder className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="text-left">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-100">
                Portfolio
              </h3>
              {/* description hidden on mobile */}
              <p className="text-xs sm:text-sm text-gray-300 mt-1 hidden sm:block">
                Selected case studies & recent projects.
              </p>
            </div>
          </a>

          <a
            href="#contact"
            className="flex-1 min-w-[44%] max-w-[48%] sm:min-w-0 sm:max-w-[280px] flex items-center gap-3 bg-white/6 backdrop-blur-sm border border-white/8 p-3 rounded-lg hover:bg-white/10 transition transform hover:-translate-y-0.5"
            aria-label="Contact"
          >
            <div className="flex-shrink-0 rounded-md text-[#fffaf9] bg-[#82181A] w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <FiMail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="text-left">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-100">
                Contact
              </h3>
              {/* description hidden on mobile */}
              <p className="text-xs sm:text-sm text-gray-300 mt-1 hidden sm:block">
                Let's collaborate on your next project.
              </p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
