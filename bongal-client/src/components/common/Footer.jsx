import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, Heart, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gray-900 text-white py-12 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0)_100%)]"></div>
      
      <div className="absolute inset-0 opacity-[0.02] bg-[length:80px_80px] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)]"></div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-white text-gray-900 p-3 rounded-2xl shadow-lg hover:bg-gray-100 transition-all duration-300 border border-gray-300/30 backdrop-blur-sm"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">

          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-3xl font-bold tracking-tight">বঙ্গাল</h3>
              <p className="text-gray-400 text-base font-medium">ঐতিহ্যের সাথে বর্তমান</p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-lg text-white">Contact Us</h4>
              <div className="space-y-4 text-gray-400">
                <div className="flex items-center space-x-4 group">
                  <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors duration-300">
                    <Phone size={18} className="text-gray-300" />
                  </div>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">+880 1799609211</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors duration-300">
                    <Mail size={18} className="text-gray-300" />
                  </div>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">bongal848@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="p-2 bg-gray-800 rounded-xl group-hover:bg-gray-700 transition-colors duration-300">
                    <MapPin size={18} className="text-gray-300" />
                  </div>
                  <span className="group-hover:text-gray-300 transition-colors duration-300">Joydebpur, Gazipur, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-white">Quick Links</h4>
            <div className="space-y-4 text-base">
              {[
                { path: '/', name: 'Home' },
                { path: '/products', name: 'Products' },
                { path: '/orders', name: 'Orders' },
                { path: '/about', name: 'About Us' },
                { path: '/contact', name: 'Contact' }
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.path}
                  className="block text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-white">Developer Information</h4>
            <div className="space-y-6">
              <div className="space-y-3">
                <h5 className="font-semibold text-white">Kawsar Ahmmed Hridoy</h5>
                <div className="flex items-center space-x-3 group">
                  <Mail size={16} className="text-gray-400" />
                  <a
                    href="mailto:kawsarhridoy0146@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    kawsarhridoy0146@gmail.com
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h5 className="font-semibold text-white">Md. Redwan Hassan</h5>
                <div className="flex items-center space-x-3 group">
                  <Mail size={16} className="text-gray-400" />
                  <a
                    href="mailto:redwan980@gmail.com"
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium"
                  >
                    redwan980@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-lg text-white">Follow Us</h4>
            
            <div className="flex space-x-4">
              {[
                { 
                  icon: Facebook, 
                  href: "https://www.facebook.com/bongal4", 
                  label: "Facebook"
                },
                { 
                  icon: Instagram, 
                  href: "https://instagram.com", 
                  label: "Instagram"
                },
                { 
                  icon: MessageCircle, 
                  href: "https://api.whatsapp.com/send?phone=%2B8801616996041", 
                  label: "WhatsApp"
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon size={20} className="text-gray-300 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
            
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-white mb-2">Stay Updated</h5>
                <p className="text-gray-400 text-sm pt-2">Get the latest updates and offers</p>
              </div>
              <div className="flex space-x-2 pt-3">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="flex-1 px-4 py-3 text-sm rounded-2xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:bg-gray-700 transition-colors duration-300"
                />
                <button className="bg-white text-gray-900 px-4 py-3 rounded-2xl text-sm font-semibold hover:bg-gray-100 transition-all duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-5">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm font-medium">
              &copy; 2025 বঙ্গাল. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;