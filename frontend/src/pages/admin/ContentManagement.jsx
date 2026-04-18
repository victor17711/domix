import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdmin } from '../../context/AdminContext';
import { toast } from '../../hooks/use-toast';
import { Image, Plus, Edit, Trash2, Save, X, ChevronDown, ChevronUp, Images } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ContentManagement = () => {
  const { getAuthHeaders } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    heroBanners: true,
    serviceAlbums: true,
    promoBanners: false,
    footer: false
  });
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    image: '',
    badge: '',
    order: 0
  });
  const [albumForm, setAlbumForm] = useState({
    title: '',
    coverImage: '',
    galleryImages: []
  });
  const [tempGalleryUrl, setTempGalleryUrl] = useState('');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`${API}/settings`);
      setBanners(response.data.heroBanners || []);
      setAlbums(response.data.albums || []);
    } catch (error) {
      console.error('Error fetching content:', error);
      setBanners([]);
      setAlbums([]);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (updatedBanners, updatedAlbums = null) => {
    try {
      // Fetch current settings first
      const currentSettings = await axios.get(`${API}/settings`);
      
      // Merge with existing settings
      const mergedSettings = {
        ...currentSettings.data,
        heroBanners: updatedBanners
      };

      // Update albums if provided
      if (updatedAlbums !== null) {
        mergedSettings.albums = updatedAlbums;
      }

      await axios.post(`${API}/settings`, mergedSettings, getAuthHeaders());
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerForm({ ...bannerForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedBanners;
      
      if (editingBanner !== null) {
        // Edit existing banner
        updatedBanners = banners.map((b, idx) => 
          idx === editingBanner ? bannerForm : b
        );
      } else {
        // Add new banner
        updatedBanners = [...banners, bannerForm];
      }

      await saveSettings(updatedBanners);

      toast({ 
        title: 'Succes', 
        description: editingBanner !== null ? 'Banner actualizat!' : 'Banner adăugat!' 
      });

      setBanners(updatedBanners);
      setShowBannerModal(false);
      setEditingBanner(null);
      setBannerForm({
        title: '',
        subtitle: '',
        description: '',
        buttonText: '',
        buttonLink: '',
        image: '',
        badge: '',
        order: 0
      });
    } catch (error) {
      console.error('Banner save error:', error);
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-a putut salva banner-ul',
        variant: 'destructive' 
      });
    }
  };

  const handleEditBanner = (index) => {
    setEditingBanner(index);
    setBannerForm(banners[index]);
    setShowBannerModal(true);
  };

  const handleDeleteBanner = async (index) => {
    if (!window.confirm('Sigur doriți să ștergeți acest banner?')) return;

    try {
      const updatedBanners = banners.filter((_, idx) => idx !== index);
      await saveSettings(updatedBanners, null);

      toast({ title: 'Succes', description: 'Banner șters!' });
      setBanners(updatedBanners);
    } catch (error) {
      console.error('Banner delete error:', error);
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-a putut șterge banner-ul',
        variant: 'destructive' 
      });
    }
  };

  // Album Handlers
  const handleAlbumSubmit = async (e) => {
    e.preventDefault();

    if (!albumForm.title || !albumForm.coverImage) {
      toast({
        title: 'Eroare',
        description: 'Titlu și imagine copertă sunt obligatorii',
        variant: 'destructive'
      });
      return;
    }

    try {
      let updatedAlbums;
      
      if (editingAlbum !== null) {
        updatedAlbums = albums.map((a, idx) => 
          idx === editingAlbum ? albumForm : a
        );
      } else {
        updatedAlbums = [...albums, albumForm];
      }

      await saveSettings(banners, updatedAlbums);

      toast({ 
        title: 'Succes', 
        description: editingAlbum !== null ? 'Album actualizat!' : 'Album adăugat!' 
      });

      setAlbums(updatedAlbums);
      setShowAlbumModal(false);
      setEditingAlbum(null);
      setAlbumForm({
        title: '',
        coverImage: '',
        galleryImages: []
      });
      setTempGalleryUrl('');
    } catch (error) {
      console.error('Album save error:', error);
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-a putut salva albumul',
        variant: 'destructive' 
      });
    }
  };

  const handleEditAlbum = (index) => {
    setEditingAlbum(index);
    setAlbumForm(albums[index]);
    setShowAlbumModal(true);
  };

  const handleDeleteAlbum = async (index) => {
    if (!window.confirm('Sigur doriți să ștergeți acest album?')) return;

    try {
      const updatedAlbums = albums.filter((_, idx) => idx !== index);
      await saveSettings(banners, updatedAlbums);

      toast({ title: 'Succes', description: 'Album șters!' });
      setAlbums(updatedAlbums);
    } catch (error) {
      console.error('Album delete error:', error);
      toast({ 
        title: 'Eroare', 
        description: error.response?.data?.detail || 'Nu s-a putut șterge albumul',
        variant: 'destructive' 
      });
    }
  };

  const addGalleryImage = () => {
    if (tempGalleryUrl && tempGalleryUrl.trim()) {
      setAlbumForm({
        ...albumForm,
        galleryImages: [...albumForm.galleryImages, tempGalleryUrl.trim()]
      });
      setTempGalleryUrl('');
    }
  };

  const removeGalleryImage = (index) => {
    setAlbumForm({
      ...albumForm,
      galleryImages: albumForm.galleryImages.filter((_, i) => i !== index)
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestionare Conținut</h1>
        <p className="text-gray-600">Editează conținutul website-ului: bannere, promoții, footer, etc.</p>
      </div>

      <div className="space-y-6">
        {/* Hero Banners Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={() => toggleSection('heroBanners')}
            className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 transition"
          >
            <div className="flex items-center gap-3">
              <Image className="w-6 h-6" />
              <div className="text-left">
                <h2 className="text-xl font-bold">Hero Banners (Slider Principal)</h2>
                <p className="text-sm text-teal-100">
                  {banners.length} {banners.length === 1 ? 'banner' : 'bannere'}
                </p>
              </div>
            </div>
            {expandedSections.heroBanners ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </button>

          {expandedSections.heroBanners && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Gestionează bannere pentru slider-ul principal de pe homepage
                </p>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setBannerForm({
                      title: '',
                      subtitle: '',
                      description: '',
                      buttonText: '',
                      buttonLink: '',
                      image: '',
                      badge: '',
                      order: banners.length
                    });
                    setShowBannerModal(true);
                  }}
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Adaugă Banner
                </button>
              </div>

              {banners.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold mb-2">Niciun banner adăugat</p>
                  <p className="text-gray-500 text-sm">Click pe "Adaugă Banner" pentru a crea primul banner</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {banners.map((banner, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-teal-500 transition">
                      {banner.image && (
                        <div className="h-48 overflow-hidden bg-gray-200">
                          <img 
                            src={banner.image} 
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        {banner.badge && (
                          <span className="inline-block bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-xs font-bold mb-2">
                            {banner.badge}
                          </span>
                        )}
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{banner.title || 'Fără titlu'}</h3>
                        {banner.subtitle && (
                          <p className="text-sm text-gray-600 mb-2">{banner.subtitle}</p>
                        )}
                        {banner.description && (
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{banner.description}</p>
                        )}
                        {banner.buttonText && (
                          <div className="flex items-center gap-2 text-teal-600 text-sm font-semibold mb-3">
                            <span>Buton: {banner.buttonText}</span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-3 border-t">
                          <button
                            onClick={() => handleEditBanner(index)}
                            className="flex-1 flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                          >
                            <Edit className="w-4 h-4" />
                            Editează
                          </button>
                          <button
                            onClick={() => handleDeleteBanner(index)}
                            className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Service Albums Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <button
            onClick={() => toggleSection('serviceAlbums')}
            className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-700 hover:to-teal-800 transition"
          >
            <div className="flex items-center gap-3">
              <Images className="w-6 h-6" />
              <div className="text-left">
                <h2 className="text-xl font-bold">Albume Servicii</h2>
                <p className="text-sm text-teal-100">
                  {albums.length} {albums.length === 1 ? 'album' : 'albume'}
                </p>
              </div>
            </div>
            {expandedSections.serviceAlbums ? (
              <ChevronUp className="w-6 h-6" />
            ) : (
              <ChevronDown className="w-6 h-6" />
            )}
          </button>

          {expandedSections.serviceAlbums && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Gestionează albumele cu poze pentru pagina Servicii
                </p>
                <button
                  onClick={() => {
                    setEditingAlbum(null);
                    setAlbumForm({
                      title: '',
                      coverImage: '',
                      galleryImages: []
                    });
                    setTempGalleryUrl('');
                    setShowAlbumModal(true);
                  }}
                  className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  Adaugă Album
                </button>
              </div>

              {albums.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <Images className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 font-semibold mb-2">Niciun album adăugat</p>
                  <p className="text-gray-500 text-sm">Click pe "Adaugă Album" pentru a crea primul album</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {albums.map((album, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-teal-500 transition">
                      {album.coverImage && (
                        <div className="h-48 overflow-hidden bg-gray-200">
                          <img 
                            src={album.coverImage} 
                            alt={album.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{album.title || 'Fără titlu'}</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {album.galleryImages.length} {album.galleryImages.length === 1 ? 'imagine' : 'imagini'} în galerie
                        </p>
                        <div className="flex gap-2 pt-3 border-t">
                          <button
                            onClick={() => handleEditAlbum(index)}
                            className="flex-1 flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition"
                          >
                            <Edit className="w-4 h-4" />
                            Editează
                          </button>
                          <button
                            onClick={() => handleDeleteAlbum(index)}
                            className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Future Sections - Promo Banners */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden opacity-50">
          <div className="px-6 py-5 bg-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image className="w-6 h-6 text-gray-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-700">Bannere Promoționale</h2>
                <p className="text-sm text-gray-500">În curând...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Sections - Footer */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden opacity-50">
          <div className="px-6 py-5 bg-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image className="w-6 h-6 text-gray-500" />
              <div>
                <h2 className="text-xl font-bold text-gray-700">Footer & Social Links</h2>
                <p className="text-sm text-gray-500">În curând...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingBanner !== null ? 'Editează Banner' : 'Banner Nou'}
              </h3>
              <button
                onClick={() => {
                  setShowBannerModal(false);
                  setEditingBanner(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleBannerSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Imagine Banner
                </label>
                {bannerForm.image && (
                  <div className="mb-3 rounded-xl overflow-hidden">
                    <img src={bannerForm.image} alt="Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Rezoluție recomandată: 1920x600px</p>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Badge (opțional)
                </label>
                <input
                  type="text"
                  value={bannerForm.badge}
                  onChange={(e) => setBannerForm({...bannerForm, badge: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="ex: Nou!, Reducere 50%"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Titlu
                </label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="ex: Colecția de Vară 2024"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Subtitlu (opțional)
                </label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({...bannerForm, subtitle: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="ex: Tendințe de sezon"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Descriere (opțional)
                </label>
                <textarea
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({...bannerForm, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Descriere scurtă pentru banner..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Button Text */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Text Buton (opțional)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({...bannerForm, buttonText: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="ex: Vezi Produse"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Link Buton (opțional)
                  </label>
                  <input
                    type="text"
                    value={bannerForm.buttonLink}
                    onChange={(e) => setBannerForm({...bannerForm, buttonLink: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="ex: /category/vara-2024"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowBannerModal(false);
                    setEditingBanner(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-semibold flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingBanner !== null ? 'Actualizează' : 'Salvează'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Album Modal */}
      {showAlbumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingAlbum !== null ? 'Editează Album' : 'Album Nou'}
              </h3>
              <button
                onClick={() => {
                  setShowAlbumModal(false);
                  setEditingAlbum(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAlbumSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Titlu Album *
                </label>
                <input
                  type="text"
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({...albumForm, title: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ex: Montaj produse"
                  required
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Imagine Copertă (URL) *
                </label>
                {albumForm.coverImage && (
                  <div className="mb-3 rounded-xl overflow-hidden">
                    <img src={albumForm.coverImage} alt="Preview" className="w-full h-48 object-cover" />
                  </div>
                )}
                <input
                  type="url"
                  value={albumForm.coverImage}
                  onChange={(e) => setAlbumForm({...albumForm, coverImage: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Poze Galerie
                </label>
                
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={tempGalleryUrl}
                    onChange={(e) => setTempGalleryUrl(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGalleryImage();
                      }
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Adaugă URL imagine galerie"
                  />
                  <button
                    type="button"
                    onClick={addGalleryImage}
                    className="px-5 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {albumForm.galleryImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                    {albumForm.galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img 
                          src={imgUrl} 
                          alt={`Galerie ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  Adaugă URL-uri pentru imaginile din galerie. {albumForm.galleryImages.length} imagini adăugate.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAlbumModal(false);
                    setEditingAlbum(null);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition font-semibold flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingAlbum !== null ? 'Actualizează' : 'Salvează'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
