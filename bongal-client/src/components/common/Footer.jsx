import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle, ArrowUp } from 'lucide-react';
import { useState} from 'react';

const Footer = () => {
  const [isHovered, setIsHovered] = useState(null);

  const colors = {
    darkBlue: '#011D4D',
    mediumBlue: '#034078',
    teal: '#1282A2',
    cream: '#E4DFDA',
    brown: '#63372C'
  };

  

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
  };

  return (
    <footer 
      className="relative py-16 overflow-hidden transition-all duration-500"
      style={{ backgroundColor: colors.darkBlue }}
    >
      <div 
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.mediumBlue} 50%, ${colors.teal} 100%)`,
          opacity: 0.1
        }}
      />

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              background: `radial-gradient(circle, ${colors.teal}20, transparent)`,
              top: `${20 + i * 25}%`,
              left: `${10 + i * 30}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: '6s'
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 max-w-6xl mx-auto">

          <div className="space-y-8">
            <div className="space-y-4 transform hover:translate-x-2 transition-transform duration-500">
              <h3 
                className="text-4xl font-bold tracking-tight transition-all duration-500 hover:scale-105 inline-block"
                style={{ color: colors.cream }}
              >
                বঙ্গাল
              </h3>
              <p 
                className="text-lg font-medium transition-all duration-500 hover:translate-x-1"
                style={{ color: colors.teal }}
              >
                ঐতিহ্যের সাথে বর্তমান
              </p>
            </div>

            <div className="space-y-6">
              <h4 
                className="font-semibold text-xl transition-all duration-500 hover:scale-105 inline-block"
                style={{ color: colors.cream }}
              >
                Contact Us
              </h4>
              <div className="space-y-5">
                {[
                  {
                    icon: Phone,
                    text: '+880 1799609211',
                    href: 'tel:+8801799609211'
                  },
                  {
                    icon: Mail,
                    text: 'bongal848@gmail.com',
                    href: 'mailto:bongal848@gmail.com'
                  },
                  {
                    icon: MapPin,
                    text: 'Joydebpur, Gazipur, Bangladesh',
                    href: 'https://maps.google.com/?q=Joydebpur,Gazipur,Bangladesh'
                  }
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-4 group transition-all duration-500 transform hover:translate-x-2"
                    onMouseEnter={() => setIsHovered(`contact-${index}`)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <div 
                      className="p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg"
                      style={{ 
                        backgroundColor: colors.mediumBlue,
                        transform: isHovered === `contact-${index}` ? 'scale(1.1) rotate(12deg)' : 'scale(1)'
                      }}
                    >
                      <item.icon 
                        size={20} 
                        style={{ color: colors.teal }}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <span 
                      className="font-medium transition-all duration-500 group-hover:font-semibold"
                      style={{ 
                        color: isHovered === `contact-${index}` ? colors.cream : `${colors.cream}cc`
                      }}
                    >
                      {item.text}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 
              className="font-semibold text-xl transition-all duration-500 hover:scale-105 inline-block"
              style={{ color: colors.cream }}
            >
              Quick Links
            </h4>
            <div className="space-y-5 text-base">
              {[
                { path: '/', name: 'Home' },
                { path: '/products', name: 'Products' },
                { path: '/orders', name: 'Orders' },
                { path: '/about', name: 'About Us' },
                { path: '/community', name: 'Community' }
              ].map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  onClick={() => handleNavigation(link.path)}
                  className="block font-medium transition-all duration-500 transform hover:translate-x-3 group relative overflow-hidden"
                  style={{ 
                    color: `${colors.cream}cc`,
                    padding: '8px 0'
                  }}
                  onMouseEnter={() => setIsHovered(`link-${index}`)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <span 
                    className="relative z-10 transition-all duration-500 group-hover:font-semibold"
                    style={{ 
                      color: isHovered === `link-${index}` ? colors.cream : `${colors.cream}cc`
                    }}
                  >
                    {link.name}
                  </span>
                  <div 
                    className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-500 group-hover:w-full"
                    style={{ 
                      backgroundColor: colors.teal,
                      opacity: isHovered === `link-${index}` ? 1 : 0
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <h4 
              className="font-semibold text-xl transition-all duration-500 hover:scale-105 inline-block"
              style={{ color: colors.cream }}
            >
              Developer Information
            </h4>

            <div className="space-y-6">
              {[
                {
                  name: 'Kawsar Ahmmed Hridoy',
                  email: 'kawsarhridoy0146@gmail.com'
                },
                {
                  name: 'Md. Redwan Hassan',
                  email: 'redwan980@gmail.com'
                }
              ].map((dev, index) => (
                <div 
                  key={index}
                  className="space-y-5 p-6 rounded-2xl transition-all duration-500 hover:shadow-2xl"
                  style={{ 
                    backgroundColor: `${colors.mediumBlue}40`,
                    border: `1px solid ${colors.mediumBlue}60`
                  }}
                >
                  <h5 
                    className="font-semibold text-base transition-all duration-500 hover:translate-x-2"
                    style={{ color: colors.cream }}
                  >
                    {dev.name}
                  </h5>

                  <a
                    href={`mailto:${dev.email}`}
                    className="flex items-center space-x-3 group transition-all duration-500 hover:translate-x-1"
                    onMouseEnter={() => setIsHovered(`dev-${index}`)}
                    onMouseLeave={() => setIsHovered(null)}
                  >
                    <Mail 
                      size={18}
                      style={{ color: colors.cream }}
                      className="shrink-0 transition-transform duration-500 group-hover:scale-110"
                    />

                    <span 
                      className="font-medium text-sm transition-all duration-500"
                      style={{ 
                        color: isHovered === `dev-${index}` 
                          ? colors.cream 
                          : `${colors.cream}cc`
                      }}
                    >
                      {dev.email}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>


          <div className="space-y-8">
            <h4 
              className="font-semibold text-xl transition-all duration-500 hover:scale-105 inline-block"
              style={{ color: colors.cream }}
            >
              Follow Us
            </h4>

            <div className="flex space-x-4">
              {[
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/bongal4",
                  label: "Facebook",
                  color: colors.teal
                },
                {
                  icon: Instagram,
                  href: "https://instagram.com",
                  label: "Instagram",
                  color: colors.teal
                },
                {
                  icon: MessageCircle,
                  href: "https://api.whatsapp.com/send?phone=%2B8801616996041",
                  label: "WhatsApp",
                  color: colors.teal
                }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-12 group shadow-lg"
                  style={{ 
                    backgroundColor: colors.mediumBlue,
                    boxShadow: `0 8px 24px ${colors.mediumBlue}40`
                  }}
                  aria-label={social.label}
                  onMouseEnter={() => setIsHovered(`social-${index}`)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <social.icon 
                    size={22} 
                    style={{ 
                      color: isHovered === `social-${index}` ? colors.cream : social.color
                    }}
                    className="transition-all duration-500 group-hover:scale-110"
                  />
                </a>
              ))}
            </div>

            <div className="space-y-6 pt-4">
              <div className="transform hover:translate-x-2 transition-transform duration-500">
                <h5 
                  className="font-semibold mb-3 transition-all duration-500 hover:scale-105 inline-block"
                  style={{ color: colors.cream }}
                >
                  Stay Updated
                </h5>
                <p 
                  className="text-sm pt-3 transition-all duration-500"
                  style={{ color: `${colors.cream}cc` }}
                >
                  Get the latest updates and offers
                </p>
              </div>
              <div className="flex space-x-3 pt-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-5 py-4 text-sm rounded-2xl border transition-all duration-500 focus:scale-105 focus:shadow-2xl placeholder-opacity-70"
                  style={{ 
                    borderColor: colors.mediumBlue,
                    backgroundColor: `${colors.mediumBlue}40`,
                    color: colors.cream,
                    placeholderColor: `${colors.cream}80`
                  }}
                />
                <button 
                  className="px-6 py-4 rounded-2xl text-sm font-semibold shadow-2xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl"
                  style={{ 
                    backgroundColor: colors.teal,
                    color: colors.cream
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = `0 12px 32px ${colors.teal}80`;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)';
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          </div>

        </div>

        <div 
          className="border-t pt-8 mt-12 transition-all duration-500"
          style={{ borderColor: `${colors.mediumBlue}60` }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
            <p 
              className="text-sm font-medium transition-all duration-500 hover:scale-105"
              style={{ color: `${colors.cream}cc` }}
            >
              &copy; 2025 বঙ্গাল. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;