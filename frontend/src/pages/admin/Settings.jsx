import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Save, Plus, X, Menu as MenuIcon, ArrowUp, ArrowDown, Folder } from 'lucide-react';
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

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentId);
  };

  const getChildCategories = (parentId) => {
    return categories.filter(cat => cat.parentId === parentId);
  };

  const addCategoryToMenu = (categoryId, includeChildren = false) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const newItems = [];
    
    // Add parent category
    const parentItem = {
      id: `cat_${Date.now()}`,
      name: category.name,
      url: `/category/${category.slug}`,
      type: 'category',
      icon: category.icon || category.image,
      categoryId: category.id,
      isParent: true
    };
    newItems.push(parentItem);

    // Add children if requested
    if (includeChildren) {
      const children = getChildCategories(categoryId);
      children.forEach((child, index) => {
        newItems.push({
          id: `cat_${Date.now()}_child_${index}`,
          name: child.name,
          url: `/category/${child.slug}`,
          type: 'category',
          icon: child.icon || child.image,
          categoryId: child.id,
          parentId: category.id,
          isChild: true
        });
      });
    }

    setCategoryItems([...categoryItems, ...newItems]);
    toast({ 
      title: 'Succes', 
      description: `${newItems.length} ${newItems.length === 1 ? 'categorie adăugată' : 'categorii adăugate'}`
    });
  };

  const addMainMenuItem = () => {
    if (!newMainItem.name) {
      toast({ title: 'Eroare', description: 'Completează numele', variant: 'destructive' });
      return;
    }

    let url = newMainItem.url;
    let icon = null;
    
    if (newMainItem.type === 'category' && newMainItem.categoryId) {
      const category = categories.find(c => c.id === newMainItem.categoryId);
      if (category) {
        url = `/category/${category.slug}`;
        icon = category.icon || category.image;
      }
    }
    
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
      id: `main_${Date.now()}`,
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

  const moveMainItem = (index, direction) => {
    const newItems = [...menuItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setMenuItems(newItems);
  };

  const moveCategoryItem = (index, direction) => {
    const newItems = [...categoryItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setCategoryItems(newItems);
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
        <p className="text-teal-100">Gestionează itemurile din meniurile site-ului. Ordinea de afișare este de sus în jos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Menu */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MenuIcon className="w-6 h-6 text-teal-600" />
            Meniu Principal
          </h3>
          
          <div className="space-y-2 mb-4">
            {menuItems.map((item, index) => (
              <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                {/* Reorder buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveMainItem(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-teal-100 hover:text-teal-700'}`}
                    title="Mută sus"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveMainItem(index, 'down')}
                    disabled={index === menuItems.length - 1}
                    className={`p-1 rounded ${index === menuItems.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-teal-100 hover:text-teal-700'}`}
                    title="Mută jos"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  {item.icon && (
                    item.icon.startsWith('data:image') ? (
                      <img src={item.icon} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <span className="text-xl">{item.icon}</span>
                    )
                  )}
                  <div>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-500">{item.url}</div>
                  </div>
                </div>

                <button
                  onClick={() => removeMainItem(item.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  title="Șterge"
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
                    {cat.parentId ? '  ↳ ' : ''}{cat.name}
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

          <div className="space-y-2 mb-4 max-h-96 overflow-y-auto">
            {categoryItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex items-center gap-2 p-3 rounded-xl hover:bg-gray-100 transition ${
                  item.isChild ? 'bg-teal-50 ml-6' : 'bg-gray-50'
                }`}
              >
                {/* Reorder buttons */}
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveCategoryItem(index, 'up')}
                    disabled={index === 0}
                    className={`p-1 rounded ${index === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-teal-100 hover:text-teal-700'}`}
                    title="Mută sus"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => moveCategoryItem(index, 'down')}
                    disabled={index === categoryItems.length - 1}
                    className={`p-1 rounded ${index === categoryItems.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-teal-100 hover:text-teal-700'}`}
                    title="Mută jos"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-1">
                  {item.icon && (
                    item.icon.startsWith('data:image') ? (
                      <img src={item.icon} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <span className="text-xl">{item.icon}</span>
                    )
                  )}
                  <div>
                    <div className={`font-semibold ${item.isChild ? 'text-sm text-gray-700' : 'text-gray-900'}`}>
                      {item.isChild && '↳ '}{item.name}
                    </div>
                    <div className="text-xs text-gray-500">{item.url}</div>
                  </div>
                </div>

                <button
                  onClick={() => removeCategoryItem(item.id)}
                  className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  title="Șterge"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3 p-4 bg-teal-50 rounded-xl">
            <h4 className="font-bold text-gray-900">Adaugă Categorie</h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto border-2 border-gray-200 rounded-xl bg-white">
              {getParentCategories().map((cat) => {
                const children = getChildCategories(cat.id);
                const hasChildren = children.length > 0;
                
                return (
                  <div key={cat.id} className="border-b last:border-b-0">
                    <div 
                      className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => addCategoryToMenu(cat.id, hasChildren)}
                    >
                      <div className="flex items-center gap-2">
                        {(cat.image || cat.icon) && (
                          (cat.image?.startsWith('data:image') || cat.icon?.startsWith('data:image')) ? (
                            <img src={cat.image || cat.icon} alt="" className="w-8 h-8 rounded object-cover" />
                          ) : (
                            <span className="text-lg">{cat.icon}</span>
                          )
                        )}
                        <span className="font-medium text-gray-900">{cat.name}</span>
                        {hasChildren && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                            +{children.length} subcategorii
                          </span>
                        )}
                      </div>
                      <Plus className="w-5 h-5 text-teal-600" />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-600">
              Click pe o categorie pentru a o adăuga. Categoriile cu subcategorii le vor adăuga automat.
            </p>
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
