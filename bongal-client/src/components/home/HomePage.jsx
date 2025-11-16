import { Package, Truck, Star, Shield, Users, Heart, ArrowRight, Sparkles } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleFeatures([0, 1, 2, 3, 4, 5]);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Package size={44} />,
      title: '100% Authentic',
      title_bn: '১০০% খাঁটি',
      description: 'গ্রাম্য পণ্য সরাসরি কৃষক এবং কারুশিল্পীদের কাছ থেকে',
      color: 'text-gray-700',
      bgColor: 'bg-blue-100/50'
    },
    {
      icon: <Truck size={44} />,
      title: 'Fast Delivery',
      title_bn: 'দ্রুত ডেলিভারি',
      description: 'বাংলাদেশ জুড়ে দ্রুত এবং নির্ভরযোগ্য ডেলিভারি',
      color: 'text-gray-700',
      bgColor: 'bg-green-100/50'
    },
    {
      icon: <Star size={44} />,
      title: 'Quality Assured',
      title_bn: 'মান নিশ্চিত',
      description: 'ডেলিভারির আগে সমস্ত পণ্য মান পরীক্ষা করা হয়',
      color: 'text-gray-700',
      bgColor: 'bg-yellow-100/50'
    },
    {
      icon: <Shield size={44} />,
      title: 'Secure Payment',
      title_bn: 'নিরাপদ পেমেন্ট',
      description: 'একাধিক নিরাপদ পেমেন্ট বিকল্প সুবিধা',
      color: 'text-gray-700',
      bgColor: 'bg-purple-100/50'
    },
    {
      icon: <Users size={44} />,
      title: 'Community Support',
      title_bn: 'সম্প্রদায় সহায়তা',
      description: 'গ্রাম্য সম্প্রদায় এবং স্থানীয় কারুশিল্পীদের সহায়তা করা হচ্ছে',
      color: 'text-gray-700',
      bgColor: 'bg-orange-100/50'
    },
    {
      icon: <Heart size={44} />,
      title: 'Customer Care',
      title_bn: 'গ্রাহক সেবা',
      description: 'আপনার সকল প্রশ্নের জন্য ২৪/৭ কাস্টমার সাপোর্ট',
      color: 'text-gray-700',
      bgColor: 'bg-pink-100/50'
    },
  ];

  return (
    <div className="overflow-hidden">
      <HeroSection />

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/30 to-white"></div>
        
        <div className="absolute inset-0 opacity-[0.01] bg-[length:80px_80px] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center space-x-2 bg-gray-100/80 backdrop-blur-sm text-gray-600 px-5 py-3 rounded-full text-sm font-medium mb-6 border border-gray-200/50">
              <Sparkles size={16} className="text-gray-500" />
              <span>Why Choose বঙ্গাল</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Experience Authenticity
            </h2>
            <p className="text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed">
              কেন বঙ্গাল বেছে নেবেন? আপনার বিশ্বস্ততার জন্য আমাদের অঙ্গীকার
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-white p-8 rounded-3xl border border-gray-200/60 hover:border-gray-300 transition-all duration-500 ${
                  visibleFeatures.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                } hover:shadow-lg hover:scale-105`}
                style={{ 
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`${feature.bgColor} p-4 rounded-2xl inline-flex mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={feature.color}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-lg text-gray-700 font-medium mb-4 bengali-text">
                  {feature.title_bn}
                </p>
                
                <p className="text-gray-500 leading-relaxed text-base">
                  {feature.description}
                </p>

                <div className="w-0 group-hover:w-12 h-0.5 bg-gray-900 mt-6 transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedProducts />

      <section className="relative py-24 bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0)_100%)]"></div>
        
        <div className="absolute inset-0 opacity-[0.02] bg-[length:60px_60px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 tracking-tight">
              Start Shopping Today
            </h2>
            <p className="text-2xl text-gray-300 font-light mb-12 leading-relaxed">
              আজই কেনাকাটা শুরু করুন এবং খাঁটি গ্রামীণ পণ্যের স্বাদ নিন
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <a
                href="/register"
                className="group bg-white text-gray-900 px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 border border-white"
              >
                <span>Create Account</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
              
              <a
                href="/products"
                className="group bg-transparent text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 border border-gray-600"
              >
                <span>Browse Products</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </a>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mt-20 pt-16 border-t border-gray-700/50 max-w-3xl mx-auto">
              {[
                { number: '500+', label: 'Happy Customers', sublabel: 'গ্রাহক' },
                { number: '100+', label: 'Local Products', sublabel: 'পণ্য' },
                { number: '20+', label: 'Villages', sublabel: 'গ্রাম' },
                { number: '24/7', label: 'Support', sublabel: 'সাপোর্ট' }
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                >
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-white tracking-tight">{stat.number}</div>
                  <div className="text-gray-300 text-base font-medium mb-1">{stat.label}</div>
                  <div className="text-gray-500 text-sm">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;