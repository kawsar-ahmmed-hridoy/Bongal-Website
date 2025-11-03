import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <h3 className="text-xl font-bold mb-4">বঙ্গাল</h3>
            <p className="text-gray-400 text-sm mb-4">ঐতিহ্যের সাথে বর্তমান</p>
            <h4 className="font-bold mb-2">Contact Us</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center space-x-2">
                <Phone size={16} /> <span>+880 1799609211</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail size={16} /> <span>bongal848@gmail.com</span>
              </p>
              <p className="flex items-center space-x-2">
                <MapPin size={16} /> <span>Joydebpur, Gazipur, Bangladesh</span>
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              {['/', '/products', '/orders', '/about', '/contact'].map((path, i) => {
                const names = ['Home', 'Products', 'Orders', 'About Us', 'Contact'];
                return (
                  <Link
                    key={i}
                    to={path}
                    className="block text-gray-400 hover:text-white transition"
                  >
                    {names[i]}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Developer Information</h4>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h3 className="font-medium text-white">Kawsar Ahmmed Hridoy</h3>
                <p className="flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <a
                    href="mailto:kawsarhridoy0146@gmail.com"
                    className="hover:underline hover:text-blue-300"
                  >
                    kawsarhridoy0146@gmail.com
                  </a>
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white">Md. Redwan Hassan</h3>
                <p className="flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2 text-blue-400" />
                  <a
                    href="mailto:redwan980@gmail.com"
                    className="hover:underline hover:text-blue-300"
                  >
                    redwan980@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/bongal4"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=%2B8801616996041"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>&copy; 2025 বঙ্গাল || All rights reserved.</p>
          <p className="mt-2">
            <Link to="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link to="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
