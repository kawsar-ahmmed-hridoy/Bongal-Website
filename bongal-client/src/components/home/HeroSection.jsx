import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Package, Users, MapPin, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className="py-16 relative overflow-hidden min-h-screen flex items-center"
      style={{
        background: `linear-gradient(135deg, ${colors.cream} 0%, ${colors.cream}dd 50%, ${colors.cream}bb 100%)`
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${6 + i % 3 * 4}px`,
              height: `${6 + i % 3 * 4}px`,
              background: `radial-gradient(circle, ${colors.teal}40, ${colors.mediumBlue}30)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          />
        ))}
        
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-15 animate-pulse-slower"
          style={{ backgroundColor: colors.darkBlue }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">

          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>

            <div className="space-y-6">
              <h1 
                className="text-6xl md:text-7xl font-bold leading-none tracking-tight bengali-text transition-all duration-700 delay-200"
                style={{ color: colors.darkBlue }}
              >
                বঙ্গাল
              </h1>
              <div className={`transition-all duration-700 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}>
                <p 
                  className="text-2xl md:text-3xl font-light leading-relaxed bengali-text mb-3"
                  style={{ color: colors.mediumBlue }}
                >
                  ঐতিহ্যের সাথে বর্তমান
                </p>
                <p className="text-lg font-medium" style={{ color: colors.teal }}>
                  Authentic Bangladeshi village products delivered to your doorstep
                </p>
              </div>
            </div>

            <div className={`transition-all duration-700 delay-600 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <p className="text-xl leading-relaxed max-w-2xl bengali-text" style={{ color: colors.darkBlue }}>
                দেশীয় খাবারের প্রকৃত স্বাদ ছড়িয়ে দিতে বঙ্গালের যাত্রা। বঙ্গাল শুধু খাবারের বিশুদ্ধতাই নিশ্চিত করে না বরং এর সাথে মিশে থাকে দেশের প্রান্তিক অঞ্চলের মাটি ও মানুষের গল্প। যা আপনাকে যুক্ত করে দেয় নিজের শিকড়ের সাথে।

                একাবিংশ শতাব্দীর এই যুগে আমরা যেসব খাবার খাই তা বেশিরভাগই রাসায়নিক কৃষির সাথে সম্পর্কযুক্ত। রাসায়নিক ও ভেজালযুক্ত খাবারের এই স্রোতের বিপরীতে বিশুদ্ধতার সাথে বঙ্গালের যে যাত্রা অব্যাহত, সে যাত্রার সঙ্গী হোন আপনিও।
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-4 px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-500 transform hover:scale-105 group border-2 shadow-2xl"
                style={{
                  backgroundColor: colors.teal,
                  color: colors.cream,
                  borderColor: colors.teal
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.mediumBlue;
                  e.target.style.borderColor = colors.mediumBlue;
                  e.target.style.transform = 'scale(1.05) translateY(-2px)';
                  e.target.style.boxShadow = `0 20px 40px ${colors.teal}40`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = colors.teal;
                  e.target.style.borderColor = colors.teal;
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                }}
              >
                <span>Shop Now</span>
                <ChevronRight 
                  size={20} 
                  className="group-hover:translate-x-2 transition-transform duration-300" 
                />
              </Link>
            </div>

            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 transition-all duration-700 delay-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              {[
                {
                  icon: Package,
                  value: '১০০+',
                  label: 'Products',
                  bengali: 'পণ্য',
                  color: colors.teal
                },
                {
                  icon: Users,
                  value: '৫০০+',
                  label: 'Customers',
                  bengali: 'গ্রাহক',
                  color: colors.mediumBlue
                },
                {
                  icon: MapPin,
                  value: '২০+',
                  label: 'Villages',
                  bengali: 'গ্রাম',
                  color: colors.darkBlue
                },
                {
                  icon: Award,
                  value: '১০০%',
                  label: 'Authentic',
                  bengali: 'খাঁটি',
                  color: colors.brown
                }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center group transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 p-4 rounded-2xl cursor-pointer"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${stat.color}25`;
                    e.currentTarget.style.boxShadow = `0 12px 32px ${stat.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${stat.color}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex justify-center mb-3">
                    <div 
                      className="p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon 
                        style={{ color: stat.color }}
                        size={20} 
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <p 
                    className="text-2xl font-semibold mb-1 bengali-text transition-all duration-500 group-hover:scale-110"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium mb-1" style={{ color: colors.darkBlue }}>
                    {stat.label}
                  </p>
                  <p className="text-xs mt-1 bengali-text" style={{ color: colors.mediumBlue }}>
                    {stat.bengali}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="relative group">
              <div 
                className="absolute inset-0 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-all duration-700"
                style={{
                  background: `linear-gradient(135deg, ${colors.mediumBlue}20, ${colors.teal}30)`,
                  filter: 'blur(8px)'
                }}
              />
              
              <div 
                className={`relative rounded-3xl overflow-hidden transition-all duration-1000 ${
                  imageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                }`}
              >
                <img
                  src="https://res.cloudinary.com/dnjvavy1h/image/upload/v1763392948/bongal/products/retmz7dfia0llyf8b7mb.jpg"
                  alt="বঙ্গালের গ্রামীণ পণ্য - Authentic Bangladeshi Village Products"
                  className="w-full h-auto transform transition-all duration-700 group-hover:scale-110"
                  onLoad={handleImageLoad}
                />
                
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                />
                
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                />
              </div>

              <div 
                className="absolute -bottom-4 -left-4 p-5 rounded-2xl shadow-2xl border transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 backdrop-blur-md"
                style={{
                  backgroundColor: `${colors.cream}f2`,
                  borderColor: `${colors.teal}40`
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="p-2 rounded-xl transition-all duration-500 hover:rotate-12"
                    style={{ backgroundColor: colors.teal }}
                  >
                    <Award className="text-white" size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: colors.mediumBlue }}>
                      Certified Authentic
                    </p>
                    <p className="text-base font-semibold" style={{ color: colors.darkBlue }}>
                      Direct from Villages
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="absolute -top-4 -right-4 p-4 rounded-2xl shadow-2xl border backdrop-blur-md animate-float"
                style={{
                  backgroundColor: `${colors.cream}f2`,
                  borderColor: `${colors.darkBlue}40`
                }}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold" style={{ color: colors.darkBlue }}>
                    Premium
                  </p>
                  <p className="text-xs" style={{ color: colors.mediumBlue }}>
                    Quality
                  </p>
                </div>
              </div>

              <div 
                className="absolute bottom-8 -right-6 p-3 rounded-xl shadow-2xl border backdrop-blur-md animate-float-delayed"
                style={{
                  backgroundColor: `${colors.cream}f2`,
                  borderColor: `${colors.brown}40`
                }}
              >
                <div className="text-center">
                  <p className="text-xs font-semibold" style={{ color: colors.brown }}>
                    Fast
                  </p>
                  <p className="text-xs" style={{ color: colors.brown }}>
                    Delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-15px) rotate(1deg); 
          }
          66% { 
            transform: translateY(-8px) rotate(-1deg); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-12px) rotate(-0.5deg); 
          }
          66% { 
            transform: translateY(-6px) rotate(0.5deg); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;