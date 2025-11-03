import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-green-200 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={16} />
              <span>100% Authentic Products</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              বঙ্গাল
              <br />
              <span className="text-green-600">ঐতিহ্যের সাথে বর্তমান</span>
            </h1>
            <p className="text-xl text-gray-700">
              Authentic village products delivered to your doorstep.
              <br />
              <span className="bengali-text">
                আপনার দোরগোড়ায় খাঁটি গ্রামীণ পণ্য।
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              >
                <span>Shop Now</span>
                <ChevronRight size={20} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center space-x-2 bg-white text-green-600 border-2 border-green-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-50 transition"
              >
                <span>Learn More</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <p className="text-3xl font-bold text-green-600">500+</p>
                <p className="text-sm text-gray-600">Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">10K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">50+</p>
                <p className="text-sm text-gray-600">Villages</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800"
              alt="Village Products"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl">
              <p className="text-sm text-gray-600">Trusted by</p>
              <p className="text-2xl font-bold text-green-600">10,000+ Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;