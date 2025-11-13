"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
import { useIntersectionObserver } from "../hooks/useIntersectionObserver";

const testimonials = [
  {
    name: "Sarah Taylor",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "CEO, Traveller",
    quote:
      "Working with this UI/UX developer was seamless. They brought our vision to life with elegance and usability.",
    rating: 5,
  },
  {
    name: "James Carter",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    role: "Product Manager",
    quote:
      "Their eye for detail and user-first design approach significantly improved our product’s experience.",
    rating: 5,
  },
  {
    name: "Emily Chen",
    img: "https://randomuser.me/api/portraits/women/46.jpg",
    role: "Founder",
    quote:
      "Excellent communication, fast delivery, and a beautiful, intuitive final design. Highly recommended!",
    rating: 4,
  },
  {
    name: "Liam Smith",
    img: "https://randomuser.me/api/portraits/men/47.jpg",
    role: "CTO",
    quote:
      "Professional and thoughtful. The final UI improved conversion rates and user satisfaction.",
    rating: 5,
  },
  {
    name: "Olivia Brown",
    img: "https://randomuser.me/api/portraits/women/48.jpg",
    role: "Marketing Lead",
    quote:
      "Great collaboration — delivered clean designs and clear handoffs for developers.",
    rating: 5,
  },
  {
    name: "Noah Wilson",
    img: "https://randomuser.me/api/portraits/men/49.jpg",
    role: "Entrepreneur",
    quote:
      "Thoughtful UX research and delightful UI. Would hire again for other projects.",
    rating: 4,
  },
];

const chunkArray = (arr: typeof testimonials, size: number) => {
  const res = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
};

const TestimonialCarousel = () => {
  const [containerRef, isVisible] = useIntersectionObserver({ threshold: 0.1 });
  const groups = chunkArray(testimonials, 3);

  return (
    <section
      ref={containerRef}
      className={
        "bg-gray-100 py-24 px-6 transition-opacity duration-1000 " +
        (isVisible ? "opacity-100" : "opacity-0")
      }
    >
      <div className="relative max-w-7xl mx-auto text-gray-900 text-center">
        <h3 className="text-sm text-[#82181A] font-semibold mb-2">
          Clients Feedback About Us
        </h3>

        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          See Those Lovely Words From Clients
        </h2>

        <p className="max-w-2xl mx-auto text-gray-600 mb-12">
          Are you tired of the typical tourist destinations and looking to step
          out of your comfort zone? Here’s what our clients say.
        </p>

        <Carousel
          showArrows
          showStatus={false}
          showThumbs={false}
          autoPlay={true} // auto play enabled
          infiniteLoop={true}
          interval={5000} // time per slide (ms)
          transitionTime={700}
          stopOnHover={false} // keep auto play even when hovered
          emulateTouch={true}
          swipeable={true}
          showIndicators={true}
          renderArrowPrev={(onClickHandler, hasPrev) =>
            hasPrev && (
              <button
                onClick={onClickHandler}
                className="absolute left-0 md:-left-16 top-1/2 transform -translate-y-1/2 bg-[#82181A]/70 hover:bg-[#6e1515] text-white p-3 rounded-full transition-all duration-300 z-20"
                aria-label="Previous testimonials"
              >
                <MdArrowBackIosNew size={20} />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext) =>
            hasNext && (
              <button
                onClick={onClickHandler}
                className="absolute right-0 md:-right-16 top-1/2 transform -translate-y-1/2 bg-[#82181A]/70 hover:bg-[#6e1515] text-white p-3 rounded-full transition-all duration-300 z-20"
                aria-label="Next testimonials"
              >
                <MdArrowForwardIos size={20} />
              </button>
            )
          }
          renderIndicator={(onClickHandler, isSelected, index, label) => (
            <li
              className={
                "inline-block mx-1 w-3 h-3 rounded-full cursor-pointer transition-all duration-300 " +
                (isSelected ? "bg-[#82181A]" : "bg-gray-400")
              }
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${index + 1}`}
            />
          )}
        >
          {groups.map((group, gi) => (
            <div
              key={gi}
              className="flex flex-col md:flex-row gap-6 px-4 md:px-0 items-stretch"
            >
              {group.map((t: (typeof testimonials)[0], i: number) => (
                <article
                  key={i}
                  className="bg-white rounded-xl p-6 shadow-md flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#f3f4f6]">
                      <img
                        src={t.img}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">{t.name}</h4>
                      <p className="text-sm text-gray-500">{t.role}</p>
                    </div>

                    <div className="ml-auto text-gray-300 hidden md:block text-4xl leading-none">
                      “
                    </div>
                  </div>

                  <p className="italic text-gray-700 flex-1 mb-4 leading-relaxed">
                    {t.quote}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <svg
                          key={idx}
                          className={
                            "w-4 h-4 " +
                            (idx < t.rating
                              ? "text-yellow-400"
                              : "text-gray-300")
                          }
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.293a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.293c.3.922-.755 1.688-1.54 1.118L10 13.347l-2.966 2.036c-.784.57-1.838-.196-1.539-1.118l1.07-3.293a1 1 0 00-.364-1.118L3.401 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.293z" />
                        </svg>
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className="text-sm text-[#82181A] font-semibold hover:underline"
                    >
                      Read more
                    </a>
                  </div>
                </article>
              ))}

              {group.length < 3 &&
                Array.from({ length: 3 - group.length }).map((_, k) => (
                  <div
                    key={`fill-${k}`}
                    className="hidden md:block md:flex-1"
                  />
                ))}
            </div>
          ))}
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
// ...existing code...
