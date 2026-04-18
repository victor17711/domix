import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, Clock, Send, Share2 } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContactPage = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContactPage();
  }, []);

  const fetchContactPage = async () => {
    try {
      const response = await axios.get(`${API}/pages/slug/contact`);
      setPageData(response.data);
    } catch (error) {
      console.error('Error fetching contact page:', error);
      // Use default data if page doesn't exist
      setPageData({
        title: 'Contactează-ne',
        content: JSON.stringify({
          address: 'Str. Principală nr. 123, Chișinău, Moldova',
          phone: '+373 69 711 967',
          email: 'support@domix.md',
          hours: 'Luni - Vineri: 09:00 - 18:00',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.2578782835143!2d28.832149476622846!3d47.02287197115092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b769a1%3A0x37d1e6d6b2a97c47!2sPiata%20Marii%20Adunari%20Nationale!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s'
        })
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axios.post(`${API}/contact/submit`, formData);
      
      toast({
        title: 'Succes!',
        description: 'Mesajul tău a fost trimis. Îți vom răspunde în curând!'
      });

      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: 'Eroare',
        description: 'Nu s-a putut trimite mesajul. Te rog încearcă din nou.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  let contactInfo = {};
  try {
    contactInfo = JSON.parse(pageData?.content || '{}');
  } catch {
    contactInfo = {
      address: 'Str. Principală nr. 123, Chișinău, Moldova',
      phone: '+373 69 711 967',
      email: 'comenzi@domix.md',
      hours: 'Luni - Vineri: 09:00 - 18:00',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2719.2578782835143!2d28.832149476622846!3d47.02287197115092!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40c97c3628b769a1%3A0x37d1e6d6b2a97c47!2sPiata%20Marii%20Adunari%20Nationale!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s'
    };
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
<div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-10 md:py-14">
  <div className="w-full px-6">
    <div className="flex items-center gap-3 mb-3">
      <Mail className="w-10 h-10" />
      <h1 className="text-3xl md:text-4xl font-bold">
        {pageData?.title || 'Contactează-ne'}
      </h1>
    </div>
    <p className="text-teal-100">
      Suntem aici să te ajutăm! Trimite-ne un mesaj.
    </p>
  </div>
</div>

      {/* BREADCRUMB */}
<div className="bg-white border-b">
  <div className="w-full px-6 py-4">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Link to="/" className="hover:text-teal-600">Acasă</Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-semibold">Contact</span>
    </div>
  </div>
</div>

      <div className="w-full px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Adresă</h3>
            <p className="text-gray-600">{contactInfo.address}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Phone className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Telefon</h3>
            <a href={`tel:${contactInfo.phone}`} className="text-teal-600 hover:text-teal-700 font-semibold">
              {contactInfo.phone}
            </a>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-7 h-7 text-teal-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
            <a href={`mailto:${contactInfo.email}`} className="text-teal-600 hover:text-teal-700 font-semibold">
              {contactInfo.email}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Trimite-ne un mesaj!</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nume *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Numele tău"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="email@exemplu.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="+373 69 123 456"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subiect *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Subiectul mesajului"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mesaj *</label>
                <textarea
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows="5"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Scrie mesajul tău aici..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-700 transition font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Se trimite...' : 'Trimite'}
              </button>
            </form>
          </div>

          {/* Map & Hours */}
          <div className="space-y-6">
            {/* Google Map */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={contactInfo.mapUrl}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Locație Google Maps"
              />
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Program</h3>
              </div>
              <p className="text-gray-600 text-lg">{contactInfo.hours}</p>
            </div>
            {/* Social Media */}
<div className="bg-white rounded-2xl p-6 shadow-lg">
  <div className="flex items-center gap-3 mb-4">
    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
      <Share2 className="w-6 h-6 text-teal-600" />
    </div>
    <h3 className="text-xl font-bold text-gray-900">Social Media</h3>
  </div>

  <div className="flex items-center gap-4">

    <a
      href="https://www.facebook.com/profile.php?id=61574327334921"
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition"
    >
      <FaFacebookF className="text-lg" />
    </a>

    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gradient-to-tr hover:from-pink-500 hover:to-yellow-500 hover:text-white transition"
    >
      <FaInstagram className="text-lg" />
    </a>

    <a
      href="https://tiktok.com/@domix.md2"
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition"
    >
      <FaTiktok className="text-lg" />
    </a>

  </div>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
