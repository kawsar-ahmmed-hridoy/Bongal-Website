import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Package, Users, MapPin, Award } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(60deg,rgba(120,119,198,0.03)_0%,rgba(120,119,198,0)_100%)]"></div>
      
      <div className="absolute inset-0 opacity-[0.02] bg-[length:50px_50px] bg-[linear-gradient(to_right,#7877C6_1px,transparent_1px),linear-gradient(to_bottom,#7877C6_1px,transparent_1px)]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-none tracking-tight">
                বঙ্গাল
              </h1>
              <p className="text-2xl md:text-3xl text-gray-600 font-light leading-relaxed">
                ঐতিহ্যের সাথে বর্তমান
                <br />
                <span className="text-lg text-gray-500 mt-2 block">
                  Authentic Bangladeshi village products delivered to your doorstep
                </span>
              </p>
            </div>
            
            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
              Experience the purity of rural Bangladesh with carefully curated products 
              from local artisans and farmers, bringing traditional craftsmanship to modern living.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-4 bg-gray-900 text-white px-8 py-4 rounded-2xl text-lg font-medium hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 group border border-gray-900"
              >
                <span>Shop Now</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12">
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3">
                  <div className="bg-blue-100/50 p-3 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                    <Package className="text-gray-700" size={20} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">১০০+</p>
                <p className="text-sm text-gray-600 font-medium">Products</p>
                <p className="text-xs text-gray-500 mt-1">পণ্য</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3">
                  <div className="bg-green-100/50 p-3 rounded-2xl group-hover:bg-green-100 transition-colors duration-300">
                    <Users className="text-gray-700" size={20} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">৫০০+</p>
                <p className="text-sm text-gray-600 font-medium">Customers</p>
                <p className="text-xs text-gray-500 mt-1">গ্রাহক</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3">
                  <div className="bg-orange-100/50 p-3 rounded-2xl group-hover:bg-orange-100 transition-colors duration-300">
                    <MapPin className="text-gray-700" size={20} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">২০+</p>
                <p className="text-sm text-gray-600 font-medium">Villages</p>
                <p className="text-xs text-gray-500 mt-1">গ্রাম</p>
              </div>
              
              <div className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="flex justify-center mb-3">
                  <div className="bg-purple-100/50 p-3 rounded-2xl group-hover:bg-purple-100 transition-colors duration-300">
                    <Award className="text-gray-700" size={20} />
                  </div>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">১০০%</p>
                <p className="text-sm text-gray-600 font-medium">Authentic</p>
                <p className="text-xs text-gray-500 mt-1">খাঁটি</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl transform rotate-1 group-hover:rotate-2 transition-transform duration-500"></div>
              <img
                src="https://scontent.fdac181-1.fna.fbcdn.net/v/t39.30808-6/470184105_122114903900614532_2858168539333650952_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHM-IciSRB9-gefxHFgl2kskf7vp9vzQvqR_u-n2_NC-vSjbtaEWskgFsTY5WpjheOz4c31HvlAcJwNGtaQrDYY&_nc_ohc=4hk26wdYcOYQ7kNvwGzqjk-&_nc_oc=AdmYK41PwJId2SLLRkirc0oPkcorbElHoD0nNFcueWWM2rwrV66DRvqQVg29pJJbGcw&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=tHSJi7tgou5K390Ym2QXTw&oh=00_AfikdldmWxmtkOlZc8yDheaQoWjVC0vsAOcTgQymltZyvw&oe=691D83FE"
                alt="বঙ্গালের গ্রামীণ পণ্য - Authentic Bangladeshi Village Products"
                className="relative rounded-3xl shadow-sm transform group-hover:scale-[1.02] transition-transform duration-500 border border-gray-200/50"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-sm border border-gray-200/80 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="bg-gray-900 p-2 rounded-xl">
                  <Award className="text-white" size={18} />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium">Certified Authentic</p>
                  <p className="text-base font-semibold text-gray-900">Direct from Villages</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-gray-200/80 animate-float">
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">Premium</p>
                <p className="text-xs text-gray-600">Quality</p>
              </div>
            </div>

            <div className="absolute bottom-8 -right-6 bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-sm border border-gray-200/80 animate-float" style={{ animationDelay: '2s' }}>
              <div className="text-center">
                <p className="text-xs font-semibold text-gray-900">Fast</p>
                <p className="text-xs text-gray-600">Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(0.5deg); }
          66% { transform: translateY(-4px) rotate(-0.5deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;