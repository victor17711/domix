import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';
import { toast } from '../../hooks/use-toast';
import { Settings as SettingsIcon, Save, Globe, Image } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SettingsManagement = () => {
  const { getAuthHeaders } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [websiteName, setWebsiteName] = useState('');
  const [favicon, setFavicon] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setWebsiteName(response.data.websiteName || 'DOMIX');
      setFavicon(response.data.favicon || '');
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const currentSettings = await axios.get(`${API}/settings`);
      
      const updatedSettings = {
        ...currentSettings.data,
        websiteName,
        favicon
      };

      await axios.post(`${API}/settings`, updatedSettings, getAuthHeaders());

      toast({ 
        title: 'Succes', 
        description: 'Setări salvate cu succes!' 
      });
    } catch (error) {
      console.error('Settings save error:', error);
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-au putut salva setările',
        variant: 'destructive' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-10 h-10" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Setări Website</h2>
            <p className="text-teal-100">Configurează numele și favicon-ul website-ului</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="space-y-6 max-w-2xl">
          {/* Website Name */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-teal-600" />
              <label className="block text-lg font-bold text-gray-900">
                Nume Website
              </label>
            </div>
            <input
              type="text"
              value={websiteName}
              onChange={(e) => setWebsiteName(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
              placeholder="ex: DOMIX Shop"
            />
            <p className="text-sm text-gray-500 mt-2">
              Acest nume va apărea în titlul paginii și în alte locuri pe website
            </p>
          </div>

          {/* Favicon */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Image className="w-5 h-5 text-teal-600" />
              <label className="block text-lg font-bold text-gray-900">
                Favicon (URL)
              </label>
            </div>
            {favicon && (
              <div className="mb-3 flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <img 
                  src={favicon} 
                  alt="Favicon preview" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <span className="text-sm text-gray-600">Preview favicon</span>
              </div>
            )}
            <input
              type="url"
              value={favicon}
              onChange={(e) => setFavicon(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="https://example.com/favicon.ico"
            />
            <p className="text-sm text-gray-500 mt-2">
              Link către imaginea favicon (recomandare: 32x32px sau 64x64px, format .ico, .png sau .svg)
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-bold text-lg flex items-center justify-center gap-3 mt-8"
          >
            <Save className="w-6 h-6" />
            Salvează Setările
          </button>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-blue-600 text-white p-3 rounded-xl">
            <SettingsIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">💡 Sfat</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Numele website-ului apare în tab-ul browserului</li>
              <li>• Favicon-ul este mica iconiță din tab-ul browserului</li>
              <li>• Pentru favicon, folosește imagini simple și clare</li>
              <li>• Verifică preview-ul înainte de a salva</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManagement;
