"use client";

import React from "react";
import Image from "next/image";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import { FiCompass, FiShield, FiArrowRight } from "react-icons/fi";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";
import { aboutMeImage } from "@/assets/images";

const About = () => {
  const [textRef, isTextVisible] = useIntersectionObserver({ threshold: 0.2 });
  const [imageRef, isImageVisible] = useIntersectionObserver({
    threshold: 0.2,
  });

  return (
    <section
      id="about"
      className="relative bg-white py-24 px-6 overflow-hidden"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* Left - text / features */}
        <div
          ref={textRef}
          className={`lg:w-1/2 transition-opacity duration-800 ${
            isTextVisible ? "animate-slideIn opacity-100" : "opacity-0"
          }`}
        >
          <p className="text-sm text-[#82181A] font-semibold mb-3">About Me</p>

          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 mb-6">
            I design human-centered interfaces that tell a story.
          </h2>

          <p className="text-gray-600 mb-8 max-w-xl">
            I’m a UI/UX designer focused on clean, usable, and beautiful digital
            products. I combine research, interaction design and visual craft to
            create memorable experiences for web and mobile.
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-none w-12 h-12 rounded-full bg-[#82181A]/10 text-[#82181A] grid place-items-center shadow-sm">
                <FiCompass size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  User-centered Research
                </h3>
                <p className="text-sm text-gray-500">
                  Research-led decisions for meaningful product improvements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-none w-12 h-12 rounded-full bg-[#82181A]/10 text-[#82181A] grid place-items-center shadow-sm">
                <FiShield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  Accessible & Robust
                </h3>
                <p className="text-sm text-gray-500">
                  Accessible, responsive designs built with performance in mind.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#contact"
              className="inline-flex items-center gap-3 bg-[#82181A] hover:bg-[#6e1515] text-white px-6 py-3 rounded-lg shadow-md transition"
            >
              <span>Work With Me</span>
              <FiArrowRight />
            </a>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#82181A] transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#82181A] transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-[#82181A] transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Right - image composition */}
        <div
          ref={imageRef}
          className={`lg:w-1/2 relative flex justify-center transition-opacity duration-800 ${
            isImageVisible ? "animate-slideIn opacity-100" : "opacity-0"
          }`}
          style={{ animationDelay: "0.15s" }}
        >
          {/* large background image */}
          <div className="w-[410px] h-[500px] rounded-2xl overflow-hidden shadow-2xl relative">
            <Image
              src={aboutMeImage}
              alt="About Me"
              fill
              className="object-cover"
            />
          </div>

          {/* inset portrait */}
          <div className="absolute left-8 top-8 w-36 h-36 rounded-xl overflow-hidden bg-white border-4 border-white shadow-lg transform rotate-1 z-10">
            <Image
              src="https://scontent.fdac99-1.fna.fbcdn.net/v/t39.30808-6/482202601_621029567510369_6347492848821931614_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeH5FZyMyRP0zlucwj9nOZDcEnICQHi7EKwScgJAeLsQrIQoBE2ofdjckMwaqhrKEv5LZ_spk6RzAVqrQOGj7vUd&_nc_ohc=eZ8g9-hE7TsQ7kNvwFfe9FG&_nc_oc=AdkfSJDaEsiPZDe0jqTihpcHi1YUpDUgaRHkoTwX94mni26LcsYyBO52XtuKcI4jPKc&_nc_zt=23&_nc_ht=scontent.fdac99-1.fna&_nc_gid=fhH5CWJahUicoM9fqqP33w&oh=00_AfhKvVYF3mJeBF-Veg7QB9zI6A4_SNQHCx482MaV264Gsg&oe=6916ACD2"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>

          {/* subtle decorative blurred circle */}
          <div
            className="absolute -left-6 bottom-10 w-28 h-28 rounded-full"
            style={{
              background: "rgba(130,24,26,0.08)",
              filter: "blur(18px)",
              zIndex: -1,
            }}
            aria-hidden="true"
          />

          {/* vertical outline text on the right */}
          <div className="hidden lg:block absolute right-[-64px] top-1/2 -translate-y-1/2">
            <span
              className="text-7xl font-extrabold uppercase tracking-wider"
              style={{
                color: "transparent",
                WebkitTextStroke: "1.8px rgba(130,24,26,0.95)",
                transform: "rotate(90deg)",
                display: "inline-block",
              }}
            >
              About
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
