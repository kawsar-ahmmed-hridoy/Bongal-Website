import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, User, CheckCircle, LogIn, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { messageService } from '../../services/messageService';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message) {
      toast.error('Please enter your message');
      return;
    }

    setLoading(true);

    try {
      await messageService.sendMessage(formData);

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-100 to-primary-50">
      {/* Hero Section */}
      <div className="bg-primary-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
            We'd love to hear from you. {user ? 'Send us a message and we\'ll respond as soon as possible.' : 'Follow us on social media or sign in to send us a message.'}
          </p>

          {/* Social Media Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <a
              href="https://facebook.com/bongal"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Facebook size={24} />
            </a>
            <a
              href="https://wa.me/8801XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Phone size={24} />
            </a>
            <a
              href="https://instagram.com/bongal"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-600 hover:bg-pink-700 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://youtube.com/@bongal"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Youtube size={24} />
            </a>
            <a
              href="https://x.com/bongal"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black hover:bg-gray-800 p-3 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Twitter size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Reach out to us through any of these channels. We're here to help you with all your questions about authentic village products from Bangladesh.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-soft">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Mail className="text-primary-800" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">support@bongal.com</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-soft">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Phone className="text-primary-800" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+880 1XXX-XXXXXX</p>
                  <p className="text-sm text-gray-500">Mon - Fri, 9AM - 6PM (GMT+6)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-soft">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <MapPin className="text-primary-800" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-600">
                    123 Village Market Street<br />
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white rounded-2xl shadow-soft">
                <div className="bg-primary-100 p-3 rounded-xl">
                  <Clock className="text-primary-800" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-soft">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-800 p-2 rounded-xl">
                <MessageCircle className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
            </div>

            {!user ? (
              <div className="text-center py-8">
                <div className="bg-primary-100 p-4 rounded-2xl mx-auto w-fit mb-6">
                  <LogIn className="text-primary-800" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Sign In Required
                </h3>
                <p className="text-gray-600 mb-6">
                  To send us a message, you need to have an account and be signed in. This helps us provide better support and track our conversations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 bg-primary-800 text-white rounded-2xl font-semibold hover:bg-primary-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <LogIn size={20} />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-6 py-3 bg-cream-100 text-primary-800 rounded-2xl font-semibold hover:bg-cream-200 transition-all duration-300"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* User Info Display */}
                <div className="mb-8 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary-800 p-2 rounded-xl">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-primary-800 font-medium">
                        Sending as:
                      </p>
                      <p className="text-sm text-primary-600">
                        {user?.name} ({user?.email})
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject (Optional)
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary-600 focus:border-primary-600 transition-all resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-800 text-white py-3.5 rounded-2xl font-semibold hover:bg-primary-700 transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="text-primary-600 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm text-primary-800 font-medium">
                        Quick Response Guarantee
                      </p>
                      <p className="text-sm text-primary-600 mt-1">
                        We typically respond to all inquiries within 24 hours during business days.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="p-6 bg-cream-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  How do I track my order?
                </h3>
                <p className="text-gray-600 text-sm">
                  Once your order is shipped, you'll receive a tracking number via email. You can also check your order status in the "Orders" section of your account.
                </p>
              </div>

              <div className="p-6 bg-cream-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  What is your return policy?
                </h3>
                <p className="text-gray-600 text-sm">
                  We offer a 7-day return policy for unused items in original packaging. Fresh products and perishables cannot be returned for hygiene reasons.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-cream-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do you deliver nationwide?
                </h3>
                <p className="text-gray-600 text-sm">
                  Yes, we deliver across Bangladesh. Delivery time varies by location: 1-2 days for Dhaka, 2-4 days for other major cities, and 3-7 days for remote areas.
                </p>
              </div>

              <div className="p-6 bg-cream-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Are your products organic?
                </h3>
                <p className="text-gray-600 text-sm">
                  Most of our products are naturally grown by village farmers using traditional methods. Look for the "Organic" label on product pages for certified organic items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;