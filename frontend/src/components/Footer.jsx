import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast({ title: 'Success', description: 'Successfully subscribed to newsletter!' });
    setEmail('');
  };

  return (
    <footer className="bg-teal-800 text-white">
      {/* Newsletter Section */}
      <div className="bg-white text-gray-800 py-12">
        <div className="w-full px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Subscribe to our newsletter</h2>
          <p className="text-gray-600 mb-6">
            Stay updated! Subscribe to our mailing list for news, updates, and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="w-full px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-yellow-400 text-teal-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">
                S
              </div>
              <span className="text-2xl font-bold">Sellzy</span>
            </div>
            <p className="text-gray-300 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-teal-800 transition">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-teal-800 transition">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-teal-800 transition">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-teal-800 transition">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-500 rounded-full flex items-center justify-center hover:bg-white hover:text-teal-800 transition">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <p className="font-semibold mb-3">Download Our App:</p>
              <div className="flex gap-2">
                <a href="#" className="inline-block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10" />
                </a>
                <a href="#" className="inline-block">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
                </a>
              </div>
            </div>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition">About Us</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white transition">Careers</Link></li>
              <li><Link to="/news" className="text-gray-300 hover:text-white transition">Latest News</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* My Account Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">My Account</h3>
            <ul className="space-y-2">
              <li><Link to="/account" className="text-gray-300 hover:text-white transition">Your Account</Link></li>
              <li><Link to="/return-policy" className="text-gray-300 hover:text-white transition">Return Policies</Link></li>
              <li><Link to="/become-vendor" className="text-gray-300 hover:text-white transition">Become a Vendor</Link></li>
              <li><Link to="/wishlist" className="text-gray-300 hover:text-white transition">Wishlist</Link></li>
              <li><Link to="/affiliate" className="text-gray-300 hover:text-white transition">Affiliate Program</Link></li>
              <li><Link to="/faqs" className="text-gray-300 hover:text-white transition">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Information's</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                <span className="text-gray-300">2715 Ash Dr. San Jose, South Dakota 83475</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 flex-shrink-0" />
                <span className="text-gray-300">Call Us: (239) 555-0108</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <span className="text-gray-300">sara.cruz@example.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Payment Methods:</p>
              <div className="flex gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8 bg-white p-1 rounded" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8 bg-white p-1 rounded" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-8 bg-white p-1 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-teal-700">
        <div className="w-full px-6 py-4 text-center text-gray-400 text-sm">
          <p>2026 Copyright By Themeforest Powered By Createuiux</p>
        </div>
      </div>

      {/* Quick Links Mobile Bottom */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="flex justify-around py-3">
          <Link to="/" className="flex flex-col items-center gap-1 text-teal-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center gap-1 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="text-xs">My Order</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center gap-1 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="text-xs">Wishlist</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center gap-1 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">My Account</span>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
