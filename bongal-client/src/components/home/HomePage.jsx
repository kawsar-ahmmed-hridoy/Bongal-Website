import { Package, Truck, Star, Shield, Users, Heart } from 'lucide-react';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';

const HomePage = () => {
  const features = [
    {
      icon: <Package size={48} />,
      title: '100% Authentic',
      title_bn: '১০০% খাঁটি',
      description: 'গ্রাম্য পণ্য সরাসরি কৃষক এবং কারুশিল্পীদের কাছ থেকে',
    },
    {
      icon: <Truck size={48} />,
      title: 'Fast Delivery',
      title_bn: 'দ্রুত ডেলিভারি',
      description: 'বাংলাদেশ জুড়ে দ্রুত এবং নির্ভরযোগ্য ডেলিভারি',
    },
    {
      icon: <Star size={48} />,
      title: 'Quality Assured',
      title_bn: 'মান নিশ্চিত',
      description: 'ডেলিভারির আগে সমস্ত পণ্য মান পরীক্ষা করা হয়',
    },
    {
      icon: <Shield size={48} />,
      title: 'Secure Payment',
      title_bn: 'নিরাপদ পেমেন্ট',
      description: 'একাধিক নিরাপদ পেমেন্ট বিকল্প সুবিধা',
    },
    {
      icon: <Users size={48} />,
      title: 'Community Support',
      title_bn: 'সম্প্রদায় সহায়তা',
      description: 'গ্রাম্য সম্প্রদায় এবং স্থানীয় কারুশিল্পীদের সহায়তা করা হচ্ছে',
    },
    {
      icon: <Heart size={48} />,
      title: 'Customer Care',
      title_bn: 'গ্রাহক সেবা',
      description: 'আপনার সকল প্রশ্নের জন্য ২৪/৭ কাস্টমার সাপোর্ট',
    },
  ];

  return (
    <div>
      
      <HeroSection />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose বঙ্গাল?</h2>
            <p className="text-gray-600 bengali-text">কেন বঙ্গাল বেছে নেবেন?</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition text-center"
              >
                <div className="text-green-600 mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-2 bengali-text">{feature.title_bn}</p>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <FeaturedProducts /> */}

      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Start Shopping Today!</h2>
          <p className="text-xl mb-8 bengali-text">
            আজই কেনাকাটা শুরু করুন এবং খাঁটি গ্রামীণ পণ্যের স্বাদ নিন!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register"
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Account
            </a>
            <a
              href="/products"
              className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-900 transition"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
