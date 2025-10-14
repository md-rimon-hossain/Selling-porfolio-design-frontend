import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { AuthWrapper } from "@/components/AuthWrapper";

export default function Home() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-gray-50">
        <Header />

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Beautiful Design Portfolio
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover amazing design templates and portfolios created by
              talented designers. Find the perfect design for your next project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-3">
                Browse Designs
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Get Started
              </Button>
            </div>
          </div>

          {/* Featured Designs Section */}
          <section className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Featured Designs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Design Card 1 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Modern Portfolio
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Clean and modern portfolio design perfect for showcasing
                    your work.
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>

              {/* Design Card 2 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-blue-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Creative Landing
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Eye-catching landing page design with creative animations.
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>

              {/* Design Card 3 */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-pink-400 to-red-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    E-commerce Store
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete e-commerce design with shopping cart and checkout
                    flow.
                  </p>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-8 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; 2025 Design Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthWrapper>
  );
}
