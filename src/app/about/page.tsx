"use client";

import { Award, Users, Target, Sparkles, Shield, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { label: "Active Designs", value: "500+", icon: Sparkles },
    { label: "Happy Customers", value: "10K+", icon: Users },
    { label: "Years Experience", value: "5+", icon: Award },
    { label: "Success Rate", value: "98%", icon: Target },
  ];

  const values = [
    {
      icon: Award,
      title: "Quality First",
      description:
        "Every design in our collection is carefully curated and meets our strict quality standards. We believe in delivering excellence.",
      gradient: "from-blue-600 to-cyan-600",
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description:
        "Our customers are at the heart of everything we do. We're committed to providing exceptional service and support.",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Your data and transactions are protected with industry-standard security. We take your privacy seriously.",
      gradient: "from-green-600 to-emerald-600",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description:
        "We foster a vibrant community of designers and creators. Together, we grow and inspire each other.",
      gradient: "from-orange-600 to-red-600",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Passionate about design and innovation",
    },
    {
      name: "Michael Chen",
      role: "Lead Designer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      bio: "Creating beautiful experiences since 2015",
    },
    {
      name: "Emily Rodriguez",
      role: "Creative Director",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
      bio: "Bringing visions to life through design",
    },
    {
      name: "David Park",
      role: "Head of Customer Success",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      bio: "Ensuring every customer has a great experience",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              About Graphic Lab
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              We&apos;re on a mission to empower creators with stunning,
              professional designs that bring their visions to life.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/designs"
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Explore Designs
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl border border-gray-100 hover:scale-105 transition-all duration-300"
                >
                  <Icon className="w-10 h-10 mx-auto mb-3 text-purple-600" />
                  <p className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Our Story
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Graphic Lab was born from a simple belief: great design should
                be accessible to everyone. What started as a small collection of
                handcrafted designs has grown into a thriving marketplace
                serving thousands of creators worldwide.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                Our journey began in 2018 when our founder, inspired by the
                challenges of finding quality design resources, decided to
                create a platform that would bridge the gap between talented
                designers and people who need their work.
              </p>
              <p className="text-gray-700 leading-relaxed text-lg">
                Today, we&apos;re proud to be a trusted partner for designers,
                developers, marketers, and entrepreneurs. Every design in our
                collection represents hours of creativity, passion, and
                dedication to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and shape how we serve our
              community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The talented individuals behind Graphic Lab who work tirelessly to
              bring you the best design experience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-purple-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers and discover the perfect
              designs for your next project.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/designs"
                className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Browse Designs
              </Link>
              <Link
                href="/pricing"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/30"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
