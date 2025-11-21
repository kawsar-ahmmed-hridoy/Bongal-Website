import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Package, Users, MapPin, Award, ArrowLeft, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C',
    lightTeal: '#1282A220'
  };

  const carouselImages = [
    {
      url: "https://scontent.fdac181-1.fna.fbcdn.net/v/t39.30808-6/470184105_122114903900614532_2858168539333650952_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHM-IciSRB9-gefxHFgl2kskf7vp9vzQvqR_u-n2_NC-vSjbtaEWskgFsTY5WpjheOz4c31HvlAcJwNGtaQrDYY&_nc_ohc=bOE3X0e9gZQQ7kNvwFjPRMa&_nc_oc=AdkcZKXmcaHhrLPZiuOyDobJCqNrCQtJ9orUrKkcHrnTSbYuv8jlY_m4KvJA8LfoVcg&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=oEwilfCPeAfgzII8wEK2Vw&oh=00_AfjsiolP2GgC8X_xoVndbvQztBpPCpbkyRQgJxHYU3KNpw&oe=692534BE",            
      title: "বঙ্গাল",
      subtitle: "Bongal"
    },
    {
      url: "https://scontent.fdac181-1.fna.fbcdn.net/v/t39.30808-6/471226610_122114864120614532_3607507821149732266_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGfiVDcApToxQbVNlksD2JqSDsEqFXDNkNIOwSoVcM2Q5pUHNLD7jDlatWRuQx9Ei-sngFeQaBbleIgqDFGcfrH&_nc_ohc=jkMdZZTwFpoQ7kNvwEMvwBk&_nc_oc=AdltgPwGPSqn-D8a-P2QwraXU-7FsruOFTn2Ty5BX90tFUlqh0DYr_q1YpFc_DUxvdw&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=iulmnB0tNLCNTgCNMXrjsw&oh=00_Afg4Rs0--3ZOHuDOGt3u31SBPLjv6J5H_98rn9wnHDN3AQ&oe=69252DA9",
      title: "",
      subtitle: ""
    },
    {
      url: "https://scontent.fdac181-1.fna.fbcdn.net/v/t39.30808-6/469322921_122111732900614532_7479689690211999592_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHDn_vEd8P_-ANept10iXZwe0TfBOM2S3N7RN8E4zZLc1JReF2Vbd8uOL0Wn9NTamaa8o0-D1a2Gjejl4Kj8km1&_nc_ohc=NdxfthU07KoQ7kNvwE6uqrM&_nc_oc=Adn_WdgfeiiqENFbqa9Sk1_9H6Al2swyheoEaQxQjf_97aombf6CJXtyiq79SxnEoiQ&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=OeD6jY4fWzvL_dQpcXcdYg&oh=00_AfgPSd9Rh-TH1E77_eoiTq8DXkBighGMoOEEmtnf0ut4Vw&oe=69254769",
      title: "",
      subtitle: ""
    },
    {
      url: "https://scontent.fdac181-1.fna.fbcdn.net/v/t39.30808-6/467677235_122108037290614532_315267619560927164_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHZ6h7xezD72ZSlJkFCBX8HUI7RlhXrm1dQjtGWFeubV16gCkGS4cZNHdg9Di5U6VBa9MHKNtNRDnIwxCgoKjwN&_nc_ohc=FRgPz1nO-uUQ7kNvwFyGlLv&_nc_oc=Adlef_qSeDN0e4HnG6XwYZb9jRxr-sKQN1f-vWpPbMzMbge-WyW-D2rLORaLTet2iAc&_nc_zt=23&_nc_ht=scontent.fdac181-1.fna&_nc_gid=xwKdQAVy-a6uVojskOKerA&oh=00_AfhGW4sNwTyjGQ8O3VWt2LzNuCd83XfXpaf5ApijBChZXA&oe=69252967",
      title: "",
      subtitle: ""
    }
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
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
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>

            <div className="space-y-3">
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
              <p className="text-lg leading-relaxed max-w-2xl bengali-text mb-4" style={{ color: colors.darkBlue }}>
                দেশীয় খাবারের প্রকৃত স্বাদ ছড়িয়ে দিতে বঙ্গালের যাত্রা। বঙ্গাল শুধু খাবারের বিশুদ্ধতাই নিশ্চিত করে না বরং এর সাথে মিশে থাকে দেশের প্রান্তিক অঞ্চলের মাটি ও মানুষের গল্প।
              </p>
              <p className="text-base leading-relaxed max-w-2xl" style={{ color: colors.mediumBlue }}>
                In an era of chemical agriculture, Bongal brings you pure, authentic products directly from Bangladeshi villages, connecting you with your roots through every bite.
              </p>
            </div>

            <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-800 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}>
              <Link
                to="/products"
                className="inline-flex items-center justify-center space-x-4 px-8 py-4 rounded-2xl text-lg font-medium transition-all duration-500 transform hover:scale-105 group border-2 shadow-2xl"
                style={{
                  backgroundColor: 'transparent',
                  color: colors.teal,
                  borderColor: colors.teal
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = colors.teal;
                  e.target.style.color = colors.cream;
                  e.target.style.transform = 'scale(1.05) translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = colors.teal;
                  e.target.style.transform = 'scale(1)';
                }}
              >
                <span>Explore Products</span>
                <ChevronRight 
                  size={20} 
                  className="group-hover:translate-x-2 transition-transform duration-300" 
                />
              </Link>
              
            </div>

            <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 transition-all duration-700 delay-1000 ${
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
                  className="text-center group transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 p-3 rounded-2xl cursor-pointer"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `${stat.color}25`;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${stat.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `${stat.color}15`;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex justify-center mb-2">
                    <div 
                      className="p-2 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon 
                        style={{ color: stat.color }}
                        size={18} 
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                  <p 
                    className="text-xl font-semibold mb-1 bengali-text transition-all duration-500 group-hover:scale-110"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium mb-1" style={{ color: colors.darkBlue }}>
                    {stat.label}
                  </p>
                  <p className="text-xs mt-1 bengali-text" style={{ color: colors.mediumBlue }}>
                    {stat.bengali}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className={`flex items-center justify-center transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="relative group w-full max-w-2xl">
              <div className="absolute inset-0 transform translate-y-4">
                <div 
                  className="w-full h-full rounded-[3rem] transform rotate-2 transition-all duration-700 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${colors.mediumBlue}15, ${colors.teal}20)`,
                    filter: 'blur(12px)'
                  }}
                />
                <div 
                  className="absolute inset-0 rounded-[3rem] transform -rotate-1 transition-all duration-700 group-hover:-rotate-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.brown}10, ${colors.darkBlue}15)`,
                    filter: 'blur(8px)'
                  }}
                />
              </div>

              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/50 backdrop-blur-sm">
                <div className="relative h-80 md:h-96 overflow-hidden rounded-[2rem]">
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? 'opacity-100 transform scale-100'
                          : 'opacity-0 transform scale-105'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 text-white transform transition-all duration-500 group-hover:translate-y-0 translate-y-2">
                        <h3 className="text-xl font-bold bengali-text drop-shadow-lg">{image.title}</h3>
                        <p className="text-sm opacity-90 drop-shadow-md">{image.subtitle}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white transition-all duration-300 hover:bg-white/40 hover:scale-110 opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  <ArrowLeft size={20} />
                </button>
                
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-white transition-all duration-300 hover:bg-white/40 hover:scale-110 opacity-0 group-hover:opacity-100 shadow-lg"
                >
                  <ArrowRight size={20} />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {carouselImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
                        index === currentSlide
                          ? 'bg-white scale-125'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div 
                className="absolute -top-3 -left-3 p-3 rounded-2xl shadow-2xl border transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 backdrop-blur-md z-10"
                style={{
                  backgroundColor: `${colors.cream}f2`,
                  borderColor: `${colors.teal}40`,
                  borderWidth: '3px'
                }}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="p-2.5 rounded-xl transition-all duration-500 hover:rotate-12"
                    style={{ backgroundColor: colors.teal }}
                  >
                    <Award className="text-white" size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: colors.mediumBlue }}>
                      Certified
                    </p>
                    <p className="text-xs" style={{ color: colors.darkBlue }}>
                      100% Authentic Product
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="absolute top-3 -right-4 p-2 rounded-2xl shadow-2xl border backdrop-blur-md animate-float-delayed z-8"
                style={{
                  backgroundColor: `${colors.cream}f2`,
                  borderColor: `${colors.darkBlue}40`,
                  borderWidth: '3px'
                }}
              >
                <div className="text-center">
                  <p className="text-xs font-semibold bengali-text" style={{ color: colors.darkBlue }}>
                    Fastest Delivary
                  </p>
                </div>
              </div>

              <div 
                className="absolute bottom-2 -right-6 p-2 rounded-xl shadow-lg border backdrop-blur-md animate-float-delayed z-8"
                style={{
                  backgroundColor: `${colors.cream}f2`,
                  borderColor: `${colors.brown}40`,
                  borderWidth: '2px'
                }}
              >
                <div className="text-center">
                  <p className="text-xs bengali-text" style={{ color: colors.brown }}>
                    Direct from Villages
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
            transform: translateY(-12px) rotate(1deg); 
          }
          66% { 
            transform: translateY(-6px) rotate(-1deg); 
          }
        }
        
        @keyframes float-delayed {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-10px) rotate(-0.5deg); 
          }
          66% { 
            transform: translateY(-4px) rotate(0.5deg); 
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