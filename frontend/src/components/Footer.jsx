import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Printer,
  BadgeDollarSign,
  ChevronRight,
} from 'lucide-react';
import { toast } from '../hooks/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast({
      title: 'Success',
      description: 'Successfully subscribed to newsletter!',
    });
    setEmail('');
  };

  return (
    <>
      {/* Newsletter Section */}
      <section className="bg-[#f5f5f5] pt-12 pb-12 md:pt-16">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="text-center">
            <h2 className="text-[#1d2433] text-[30px] md:text-[38px] font-bold leading-tight">
              Abonează-te la noutăți
            </h2>

            <p className="mt-5 text-[#94A3B8] text-[15px] md:text-[16px] leading-[1.7]">
              Abonează-te la lista noastră de email pentru noutăți, actualizări și oferte exclusive.
            </p>

            <form
              onSubmit={handleSubscribe}
              className="mt-7 mx-auto w-full max-w-[500px]"
            >
              <div className="h-[58px] rounded-full border border-[#D9E0E7] bg-white flex items-center pl-5 pr-[7px] shadow-[0_4px_18px_rgba(15,92,92,0.06)]">
                <Mail className="w-5 h-5 text-[#4B5563] shrink-0" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresa de email"
                  required
                  className="flex-1 h-full bg-transparent outline-none px-4 text-[16px] text-[#64748B] placeholder:text-[#94A3B8]"
                />

                <button
                  type="submit"
                  className="h-[42px] px-7 md:px-9 rounded-full bg-[#0f8b8d] text-white font-semibold text-[16px] hover:bg-[#0d7c7e] transition"
                >
                  Abonează-te
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0d5c63] pt-10 md:pt-12 pb-[100px] md:pb-14 xl:rounded-tr-[22px] xl:rounded-tl-[22px] relative">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 pb-9">
            {/* Column 1 */}
            <div className="col-span-12 md:col-span-12 xl:col-span-3 flex flex-col gap-y-6">
              <div>
                <Link to="/" className="inline-flex items-center gap-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-[#FFD65A] flex items-center justify-center text-[#0d5c63] font-bold text-[22px] leading-none">
                      S
                    </div>
                    <span className="ml-2 text-[#FFD65A] text-[28px] font-bold leading-none">
                      Sellzy
                    </span>
                  </div>
                </Link>
              </div>

              <p className="text-[#D8ECE6] text-base leading-[1.8] max-w-[330px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-4">
                {/* <a
                  href="#"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                >
                  <Instagram className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                >
                  <Pinterest className="w-5 h-5 text-white" />
                </a> */}
                <a
                  href="#"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-[rgba(145,158,171,0.16)]"
                >
                  <BadgeDollarSign className="w-5 h-5 text-white" />
                </a>
              </div>

              <div className="flex flex-col gap-y-[15px]">
                <p className="text-base font-semibold text-[#D8ECE6]">
                  Download Our App:
                </p>

                <div className="flex gap-x-2.5">
                  <a href="#">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="google-play"
                      className="h-[44px] w-auto"
                    />
                  </a>
                  <a href="#">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="apple-store"
                      className="h-[44px] w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="col-span-12 md:col-span-6 xl:col-span-2">
              <h5 className="text-[#D8ECE6] text-[18px] font-semibold pb-6 border-b border-[rgba(145,158,171,0.24)]">
                About
              </h5>

              <ul className="flex flex-col gap-y-1.5 pt-4">
                {[
                  { to: '/about', label: 'About Us' },
                  { to: '/terms', label: 'Terms & Conditions' },
                  { to: '/careers', label: 'Careers' },
                  { to: '/news', label: 'Latest News' },
                  { to: '/contact', label: 'Contact Us' },
                  { to: '/privacy', label: 'Privacy Policy' },
                ].map((item) => (
                  <li key={item.label} className="py-1.5 flex items-center gap-x-2">
                    <span className="inline-flex items-center">
                      <ChevronRight className="w-5 h-5 text-[#D8ECE6]" />
                    </span>
                    <Link
                      to={item.to}
                      className="text-[#D8ECE6] font-semibold hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 */}
            <div className="col-span-12 md:col-span-6 xl:col-span-2">
              <h5 className="text-[#D8ECE6] text-[18px] font-semibold pb-6 border-b border-[rgba(145,158,171,0.24)]">
                My Account
              </h5>

              <ul className="flex flex-col gap-y-1.5 pt-4">
                {[
                  { to: '/account', label: 'Your Account' },
                  { to: '/return-policy', label: 'Return Policies' },
                  { to: '/become-vendor', label: 'Become a Vendor' },
                  { to: '/wishlist', label: 'Wishlist' },
                  { to: '/affiliate', label: 'Affiliate Program' },
                  { to: '/faqs', label: 'FAQs' },
                ].map((item) => (
                  <li key={item.label} className="py-1.5 flex items-center gap-x-2">
                    <span className="inline-flex items-center">
                      <ChevronRight className="w-5 h-5 text-[#D8ECE6]" />
                    </span>
                    <Link
                      to={item.to}
                      className="text-[#D8ECE6] font-semibold hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4 */}
            <div className="col-span-12 md:col-span-6 xl:col-span-2">
              <h5 className="text-[#D8ECE6] text-[18px] font-semibold pb-6 border-b border-[rgba(145,158,171,0.24)]">
                Categories
              </h5>

              <ul className="flex flex-col gap-y-1.5 pt-4">
                {[
                  'Healthcare',
                  'Fashion',
                  'Organic',
                  'Beauty',
                  'Groceries',
                  'Fahion',
                ].map((item) => (
                  <li key={item} className="py-1.5 flex items-center gap-x-2">
                    <span className="inline-flex items-center">
                      <ChevronRight className="w-5 h-5 text-[#D8ECE6]" />
                    </span>
                    <Link
                      to="#"
                      className="text-[#D8ECE6] font-semibold hover:underline"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5 */}
            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <h5 className="text-[#D8ECE6] text-[18px] font-semibold pb-6 border-b border-[rgba(145,158,171,0.24)]">
                Contact Information&apos;s
              </h5>

              <ul className="flex flex-col gap-y-3 py-4">
                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)] shrink-0">
                    <MapPin className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold leading-[1.6]">
                    2715 Ash Dr. San Jose, South Dakota 83475
                  </p>
                </li>

                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)] shrink-0">
                    <Phone className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold">
                    Call Us: (239) 555-0108
                  </p>
                </li>

                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)] shrink-0">
                    <Mail className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold">
                    sara.cruz@example.com
                  </p>
                </li>

                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[rgba(145,158,171,0.16)] shrink-0">
                    <Printer className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold">
                    sara.cruz@example.com
                  </p>
                </li>
              </ul>

              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-3">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                    alt="Visa"
                    className="h-9 w-auto object-contain"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png"
                    alt="Mastercard"
                    className="h-9 w-auto object-contain"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg"
                    alt="American Express"
                    className="h-9 w-auto object-contain"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="h-9 w-auto object-contain"
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                    alt="Apple Pay"
                    className="h-9 w-auto object-contain bg-[#1F2937] rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="text-center text-white pt-[22px] pb-px bg-no-repeat bg-center relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-[520px] h-[48px] border-t border-[#1b7a7f] rounded-t-[120px]" />
            <p className="relative z-10 text-[15px] text-[#EAF6F2]">
              2026 Copyright By Themeforest Powered By Createuiux
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;