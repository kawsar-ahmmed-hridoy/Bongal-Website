import { Package, Truck, Star, Shield, Users, Heart, ArrowRight, Sparkles } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setVisibleFeatures([0, 1, 2, 3, 4, 5]);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Package size={32} />,
      title: '100% Authentic',
      title_bn: '১০০% খাঁটি',
      description: 'গ্রাম্য পণ্য সরাসরি কৃষক এবং কারুশিল্পীদের কাছ থেকে',
      color: colors.teal,
      bgColor: `${colors.teal}15`
    },
    {
      icon: <Truck size={32} />,
      title: 'Fast Delivery',
      title_bn: 'দ্রুত ডেলিভারি',
      description: 'বাংলাদেশ জুড়ে দ্রুত এবং নির্ভরযোগ্য ডেলিভারি',
      color: colors.mediumBlue,
      bgColor: `${colors.mediumBlue}15`
    },
    {
      icon: <Star size={32} />,
      title: 'Quality Assured',
      title_bn: 'মান নিশ্চিত',
      description: 'ডেলিভারির আগে সমস্ত পণ্য মান পরীক্ষা করা হয়',
      color: colors.brown,
      bgColor: `${colors.brown}15`
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Payment',
      title_bn: 'নিরাপদ পেমেন্ট',
      description: 'একাধিক নিরাপদ পেমেন্ট বিকল্প সুবিধা',
      color: colors.darkBlue,
      bgColor: `${colors.darkBlue}15`
    },
    {
      icon: <Users size={32} />,
      title: 'Community Support',
      title_bn: 'সম্প্রদায় সহায়তা',
      description: 'গ্রাম্য সম্প্রদায় এবং স্থানীয় কারুশিল্পীদের সহায়তা করা হচ্ছে',
      color: colors.teal,
      bgColor: `${colors.teal}15`
    },
    {
      icon: <Heart size={32} />,
      title: 'Customer Care',
      title_bn: 'গ্রাহক সেবা',
      description: 'আপনার সকল প্রশ্নের জন্য ২৪/৭ কাস্টমার সাপোর্ট',
      color: colors.mediumBlue,
      bgColor: `${colors.mediumBlue}15`
    },
  ];

  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturedProducts />

      <section 
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: colors.cream }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-slow"
              style={{
                width: `${8 + i % 4 * 6}px`,
                height: `${8 + i % 4 * 6}px`,
                background: `radial-gradient(circle, ${colors.teal}20, ${colors.mediumBlue}15)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.8}s`,
                animationDuration: `${12 + i * 3}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center mb-16 transition-all duration-700 delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div 
              className="inline-flex items-center space-x-2 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-medium mb-6 border transition-all duration-500 hover:scale-105"
              style={{
                backgroundColor: `${colors.mediumBlue}15`,
                color: colors.darkBlue,
                borderColor: `${colors.mediumBlue}30`
              }}
            >
              <Sparkles size={16} style={{ color: colors.teal }} />
              <span>Why Choose বঙ্গাল</span>
            </div>

            <h2 
              className="text-4xl md:text-5xl font-bold mb-4 tracking-tight transition-all duration-700 delay-300"
              style={{ color: colors.darkBlue }}
            >
              Experience Authenticity
            </h2>
            <p 
              className="text-xl text-gray-600 font-light max-w-2xl mx-auto leading-relaxed transition-all duration-700 delay-400"
              style={{ color: colors.mediumBlue }}
            >
              কেন বঙ্গাল বেছে নেবেন? আপনার বিশ্বস্ততার জন্য আমাদের অঙ্গীকার
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                  visibleFeatures.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  backgroundColor: `${colors.cream}f8`,
                  borderColor: `${feature.color}30`,
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${feature.color}60`;
                  e.currentTarget.style.boxShadow = `0 12px 32px ${feature.color}20`;
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${feature.color}30`;
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                }}
              >
                <div 
                  className="p-3 rounded-xl inline-flex mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <div style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                </div>

                <h3 
                  className="text-xl font-semibold mb-2 tracking-tight transition-all duration-500 group-hover:translate-x-1"
                  style={{ color: colors.darkBlue }}
                >
                  {feature.title}
                </h3>

                <p 
                  className="text-base font-medium mb-3 bengali-text transition-all duration-500 group-hover:translate-x-1"
                  style={{ color: feature.color }}
                >
                  {feature.title_bn}
                </p>

                <p 
                  className="text-sm leading-relaxed transition-all duration-500 group-hover:translate-x-1"
                  style={{ color: colors.mediumBlue }}
                >
                  {feature.description}
                </p>

                <div 
                  className="w-0 group-hover:w-16 h-0.5 mt-4 transition-all duration-500 rounded-full"
                  style={{ backgroundColor: feature.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          33% { 
            transform: translateY(-12px) rotate(0.8deg); 
          }
          66% { 
            transform: translateY(-6px) rotate(-0.8deg); 
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.12; }
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;