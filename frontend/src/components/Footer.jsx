import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Printer, BadgeDollarSign, ChevronRight, Facebook, Instagram, Music2, Globe } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import logo from '../assets/images/logo.png';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

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
              <div className="h-[58px] rounded-full border border-[#D9E0E7] bg-white flex items-center pl-3 md:pl-5 pr-2 md:pr-[7px] shadow-[0_4px_18px_rgba(15,92,92,0.06)]">

                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#4B5563] shrink-0" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresa de email"
                  required
                  className="flex-1 h-full bg-transparent outline-none px-2 md:px-4 text-[14px] md:text-[16px] text-[#64748B] placeholder:text-[#94A3B8]"
                />

                <button
                  type="submit"
                  className="
      h-[36px] md:h-[42px]
      px-4 md:px-7
      text-[14px] md:text-[16px]
      rounded-full
      bg-[#16a085]
      text-white font-semibold
      hover:bg-[#0d7c7e]
      transition
      whitespace-nowrap
    "
                >
                  Abonează-te
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#16a085] pt-10 md:pt-12 pb-[50px] md:pb-12 xl:rounded-tr-[22px] xl:rounded-tl-[22px] relative">
        <div className="max-w-[1320px] mx-auto px-4">
          <div className="grid grid-cols-12 gap-x-6 gap-y-10 pb-9">
            {/* Column 1 */}
            <div className="col-span-12 md:col-span-12 xl:col-span-3 flex flex-col gap-y-6">
              <div>
                <Link to="/" className="inline-flex items-center">
                  <img
                    src={logo}
                    alt="Domix"
                    className="h-16 md:h-16 object-contain invert brightness-0"
                  />
                </Link>
              </div>

              <p className="text-[#D8ECE6] text-base leading-[1.8] max-w-[330px]">
                Partenerul tău de încredere în construcții. Oferim o gamă variată de materiale de calitate pentru proiecte durabile, la prețuri competitive.
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61574327334921"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <FaFacebookF className="w-4 h-4 text-white" />
                </a>

                <a
                  href="https://instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <FaInstagram className="w-4 h-4 text-white" />
                </a>

                <a
                  href="https://tiktok.com/@domix.md2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center size-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                  <FaTiktok className="w-4 h-4 text-white" />
                </a>
              </div>

              {/* <div className="flex flex-col gap-y-[15px]">
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
              </div> */}
            </div>

            {/* Column 2 */}
            <div className="col-span-12 md:col-span-6 xl:col-span-2">
              <h5 className="text-[#D8ECE6] text-[20px] font-semibold pb-0 border-b border-[rgba(145,158,171,0.24)]">
                Link-uri utile
              </h5>

              <ul className="flex flex-col gap-y-1.5 pt-4">
                {[
                  { to: '/despre-noi', label: 'Despre Noi' },
                  { to: '/catalog', label: 'Catalog' },
                  { to: '/servicii', label: 'Servicii' },
                  { to: '/brands', label: 'Branduri' },
                  { to: '/contact', label: 'Contacte' },
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
              <h5 className="text-[#D8ECE6] text-[20px] font-semibold pb-0 border-b border-[rgba(145,158,171,0.24)]">
                Informații
              </h5>

              <ul className="flex flex-col gap-y-1.5 pt-4">
                {[
                  { to: '/page/termeni-si-conditii', label: 'Termeni și condiții' },
                  { to: '/page/politica-de-confidentialitate', label: 'Politica de conf.' },
                  { to: '/page/politica-cookie', label: 'Politica Cookie' },
                  { to: '/page/livrare-si-plata', label: 'Livrare și plata' },
                  { to: '/intrebari-frecvente', label: 'Întrebări frecvente' },
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
              <h5 className="text-[#D8ECE6] text-[20px] font-semibold pb-0 border-b border-[rgba(145,158,171,0.24)]">
                Categorii
              </h5>

              <ul className="flex flex-col gap-y-1.5 pt-4">
                {[
                  { to: '/toate-produsele', label: 'Toate produsele' },
                  { to: '/produse-cu-reducere', label: 'Produse cu reducere' },
                  { to: '/cele-mai-vandute', label: 'Cele mai vândute' },
                  { to: '/produse-noi', label: 'Produse noi' },
                  // { to: '/intrebari-frecvente', label: 'Întrebări frecvente' },
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

            {/* Column 5 */}
            <div className="col-span-12 md:col-span-6 xl:col-span-3">
              <h5 className="text-[#D8ECE6] text-[20px] font-semibold pb-o border-b border-[rgba(145,158,171,0.24)]">
                Contacte
              </h5>

              <ul className="flex flex-col gap-y-3 py-4">
                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[#ffffff]/20 shrink-0">
                    <MapPin className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold leading-[1.6]">
                    Republica Moldova, or. Chișinău, str. Calea Ieșilor 2A
                  </p>
                </li>

                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[#ffffff]/20 shrink-0">
                    <Phone className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold">
                    Sună: (373) 697 11 967
                  </p>
                </li>

                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[#ffffff]/20 shrink-0">
                    <Mail className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold">
                    support@domix.md
                  </p>
                </li>

                <li className="flex items-center gap-x-3">
                  <span className="size-10 inline-flex items-center justify-center rounded-full bg-[#ffffff]/20 shrink-0">
                    <Mail className="w-5 h-5 text-[#D8ECE6]" />
                  </span>
                  <p className="text-[#D8ECE6] font-semibold">
                    comenzi@domix.md
                  </p>
                </li>
              </ul>

              {/* <div className="pt-2">
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
              </div> */}
            </div>
          </div>

          {/* Bottom */}
          <div className="text-center text-white pt-[22px] pb-px bg-no-repeat bg-center relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-[520px] h-[48px] border-t border-[#fff] rounded-t-[120px]" />
            <p className="relative z-10 text-[15px] text-[#EAF6F2]">
              © 2026 Domix. Powered By{" "}
              <a
                href="https://nextify.md"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white transition"
              >
                Nextify
              </a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;