import { Button } from "@/components/ui/button";
import Link from "next/link";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedDesigns from "@/components/FeaturedDesigns";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Content */}
        <div className="text-center mb-20">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/60 rounded-full px-6 py-3 mb-8 shadow-lg border border-white/80">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">✨ New designs added daily</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
              Beautiful Design
            </span>
            <br />
            <span className="text-gray-900">Portfolio</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
            Discover amazing design templates and portfolios created by{" "}
            <span className="text-blue-600 font-bold">talented designers</span>.
            <br className="hidden md:block" />
            Find the perfect design for your next{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">
              groundbreaking project
            </span>
            .
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/designs">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all rounded-2xl font-bold group"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Designs
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <Link href="/categories">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-10 py-7 h-auto border-3 border-gray-900 hover:bg-gray-900 hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all rounded-2xl font-bold group"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7v14a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2h10a2 2 0 012 2zM9 11h6" />
                </svg>
                View Categories
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="text-center backdrop-blur-sm bg-white/60 rounded-2xl px-8 py-4 shadow-lg border border-white/80">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                1000+
              </div>
              <div className="text-sm text-gray-600 font-semibold">Designs</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/60 rounded-2xl px-8 py-4 shadow-lg border border-white/80">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                50+
              </div>
              <div className="text-sm text-gray-600 font-semibold">Categories</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/60 rounded-2xl px-8 py-4 shadow-lg border border-white/80">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent mb-1">
                100+
              </div>
              <div className="text-sm text-gray-600 font-semibold">Designers</div>
            </div>
            <div className="text-center backdrop-blur-sm bg-white/60 rounded-2xl px-8 py-4 shadow-lg border border-white/80">
              <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600 font-semibold">Support</div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <CategoriesSection />

        {/* Featured Designs Section */}
        <FeaturedDesigns />

        {/* CTA Section */}
        <section className="mt-32 relative">
          <div className="backdrop-blur-sm bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-center shadow-2xl border border-white/20 overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                Ready to Start Creating?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of designers and creators who trust our platform for their design needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-7 h-auto bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all rounded-2xl font-bold"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-10 py-7 h-auto border-2 border-white text-white hover:bg-white/10 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all rounded-2xl font-bold"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}