import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Save, Plus, X, Menu as MenuIcon, ChevronDown } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Settings = () => {
  const { getAuthHeaders } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [categoryItems, setCategoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pages, setPages] = useState([]);
  
  const [newMainItem, setNewMainItem] = useState({ 
    name: '', 
    url: '', 
    type: 'link',
    categoryId: '',
    pageId: ''
  });
  
  const [newCategoryItem, setNewCategoryItem] = useState({ 
    name: '', 
    type: 'category',
    categoryId: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, categoriesRes, pagesRes] = await Promise.all([
        axios.get(`${API}/settings`),
        axios.get(`${API}/categories`),
        axios.get(`${API}/pages`)
      ]);
      
      setMenuItems(settingsRes.data.menuItems || []);
      setCategoryItems(settingsRes.data.categoryMenuItems || []);
      setCategories(categoriesRes.data);
      setPages(pagesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Eroare', description: 'Nu s-au putut încărca datele', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const addMainMenuItem = () => {
    if (!newMainItem.name) {
      toast({ title: 'Eroare', description: 'Completează numele', variant: 'destructive' });
      return;
    }

    let url = newMainItem.url;
    let icon = null;
    
    // If type is category, find the category
    if (newMainItem.type === 'category' && newMainItem.categoryId) {
      const category = categories.find(c => c.id === newMainItem.categoryId);
      if (category) {
        url = `/category/${category.slug}`;
        icon = category.icon;
      }
    }
    
    // If type is page, find the page
    if (newMainItem.type === 'page' && newMainItem.pageId) {
      const page = pages.find(p => p.id === newMainItem.pageId);
      if (page) {
        url = `/page/${page.slug}`;
      }
    }

    if (!url) {
      toast({ title: 'Eroare', description: 'Completează URL sau selectează o categorie/pagină', variant: 'destructive' });
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: newMainItem.name,
      url: url,
      type: newMainItem.type,
      icon: icon,
      categoryId: newMainItem.categoryId || null,
      pageId: newMainItem.pageId || null
    };

    setMenuItems([...menuItems, newItem]);
    setNewMainItem({ name: '', url: '', type: 'link', categoryId: '', pageId: '' });
    toast({ title: 'Succes', description: 'Item adăugat în meniul principal' });
  };

  const addCategoryMenuItem = () => {
    if (!newCategoryItem.categoryId) {
      toast({ title: 'Eroare', description: 'Selectează o categorie', variant: 'destructive' });
      return;
    }

    const category = categories.find(c => c.id === newCategoryItem.categoryId);
    if (!category) return;

    const newItem = {
      id: Date.now().toString(),
      name: category.name,
      url: `/category/${category.slug}`,
      type: 'category',
      icon: category.icon,
      categoryId: category.id
    };

    setCategoryItems([...categoryItems, newItem]);
    setNewCategoryItem({ name: '', type: 'category', categoryId: '' });
    toast({ title: 'Succes', description: 'Categorie adăugată în meniu' });
  };

  const removeMainItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({ title: 'Succes', description: 'Item șters din meniul principal' });
  };

  const removeCategoryItem = (id) => {
    setCategoryItems(categoryItems.filter(item => item.id !== id));
    toast({ title: 'Succes', description: 'Item șters din meniul categorii' });
  };

  const handleSave = async () => {
    try {
      await axios.post(`${API}/settings`, {
        menuItems,
        categoryMenuItems: categoryItems
      }, getAuthHeaders());
      
      toast({ title: 'Succes', description: 'Setările au fost salvate!' });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({ title: 'Eroare', description: 'Nu s-au putut salva setările', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="text-center py-12">Se încarcă...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Setări Meniuri</h2>
        <p className="text-teal-100">Gestionează itemurile din meniurile site-ului</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Menu */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MenuIcon className="w-6 h-6 text-teal-600" />
            Meniu Principal
          </h3>
          
          <div className="space-y-3 mb-4">
            {menuItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.url}</div>
                    <div className="text-xs text-teal-600 capitalize">{item.type}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeMainItem(item.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 p-4 bg-teal-50 rounded-xl">
            <h4 className="font-bold text-gray-900">Adaugă Item Nou</h4>
            
            <select
              value={newMainItem.type}
              onChange={(e) => setNewMainItem({...newMainItem, type: e.target.value, url: '', categoryId: '', pageId: ''})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="link">Link Custom</option>
              <option value="category">Categorie</option>
              <option value="page">Pagină</option>
            </select>

            <input
              type="text"
              placeholder="Nume (ex: Acasă, Contact)"
              value={newMainItem.name}
              onChange={(e) => setNewMainItem({...newMainItem, name: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            {newMainItem.type === 'link' && (
              <input
                type="text"
                placeholder="URL (ex: /contact, /about)"
                value={newMainItem.url}
                onChange={(e) => setNewMainItem({...newMainItem, url: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            )}

            {newMainItem.type === 'category' && (
              <select
                value={newMainItem.categoryId}
                onChange={(e) => setNewMainItem({...newMainItem, categoryId: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selectează o categorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            )}

            {newMainItem.type === 'page' && (
              <select
                value={newMainItem.pageId}
                onChange={(e) => setNewMainItem({...newMainItem, pageId: e.target.value})}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Selectează o pagină</option>
                {pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={addMainMenuItem}
              className="w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adaugă
            </button>
          </div>
        </div>

        {/* Categories Menu */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MenuIcon className="w-6 h-6 text-teal-600" />
            Meniu Toate Categoriile
          </h3>
          
          <p className="text-sm text-gray-600 mb-4">
            Acestea vor apărea în dropdown-ul "Toate categoriile" din navbar
          </p>

          <div className="space-y-3 mb-4">
            {categoryItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  {item.icon && <span className="text-xl">{item.icon}</span>}
                  <div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.url}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeCategoryItem(item.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 p-4 bg-teal-50 rounded-xl">
            <h4 className="font-bold text-gray-900">Adaugă Categorie</h4>
            
            <select
              value={newCategoryItem.categoryId}
              onChange={(e) => setNewCategoryItem({...newCategoryItem, categoryId: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Selectează o categorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>

            <button
              onClick={addCategoryMenuItem}
              className="w-full bg-teal-600 text-white py-2 rounded-xl hover:bg-teal-700 transition font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Adaugă
            </button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl hover:from-teal-700 hover:to-teal-800 transition font-semibold flex items-center gap-2"
        >
          <Save className="w-5 h-5" />
          Salvează Setările
        </button>
      </div>
    </div>
  );
};

export default Settings;
