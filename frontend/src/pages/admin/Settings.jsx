import React, { useState } from 'react';
import { Save, Plus, X, Menu as MenuIcon } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const Settings = () => {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Acasă', url: '/', type: 'main' },
    { id: 2, name: 'Despre Noi', url: '/about', type: 'main' },
    { id: 3, name: 'Magazin', url: '/shop', type: 'main' },
    { id: 4, name: 'Contact', url: '/contact', type: 'main' }
  ]);

  const [categoryItems, setCategoryItems] = useState([
    { id: 1, name: 'Îmbrăcăminte Femei', url: '/category/womens-clothing' },
    { id: 2, name: 'Îmbrăcăminte Bărbați', url: '/category/mens-clothing' },
    { id: 3, name: 'Copii & Bebeluși', url: '/category/kids-clothing' }
  ]);

  const [newMainItem, setNewMainItem] = useState({ name: '', url: '' });
  const [newCategoryItem, setNewCategoryItem] = useState({ name: '', url: '' });

  const addMainMenuItem = () => {
    if (!newMainItem.name || !newMainItem.url) {
      toast({ title: 'Eroare', description: 'Completează toate câmpurile', variant: 'destructive' });
      return;
    }
    setMenuItems([...menuItems, { ...newMainItem, id: Date.now(), type: 'main' }]);
    setNewMainItem({ name: '', url: '' });
    toast({ title: 'Succes', description: 'Item adăugat în meniul principal' });
  };

  const addCategoryMenuItem = () => {
    if (!newCategoryItem.name || !newCategoryItem.url) {
      toast({ title: 'Eroare', description: 'Completează toate câmpurile', variant: 'destructive' });
      return;
    }
    setCategoryItems([...categoryItems, { ...newCategoryItem, id: Date.now() }]);
    setNewCategoryItem({ name: '', url: '' });
    toast({ title: 'Succes', description: 'Item adăugat în meniul categorii' });
  };

  const removeMainItem = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast({ title: 'Succes', description: 'Item șters din meniul principal' });
  };

  const removeCategoryItem = (id) => {
    setCategoryItems(categoryItems.filter(item => item.id !== id));
    toast({ title: 'Succes', description: 'Item șters din meniul categorii' });
  };

  const handleSave = () => {
    toast({ title: 'Succes', description: 'Setările au fost salvate!' });
  };

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
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.url}</div>
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
            <input
              type="text"
              placeholder="Nume"
              value={newMainItem.name}
              onChange={(e) => setNewMainItem({...newMainItem, name: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              placeholder="URL (ex: /contact)"
              value={newMainItem.url}
              onChange={(e) => setNewMainItem({...newMainItem, url: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
          
          <div className="space-y-3 mb-4">
            {categoryItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.url}</div>
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
            <h4 className="font-bold text-gray-900">Adaugă Item Nou</h4>
            <input
              type="text"
              placeholder="Nume"
              value={newCategoryItem.name}
              onChange={(e) => setNewCategoryItem({...newCategoryItem, name: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              placeholder="URL (ex: /category/haine-femei)"
              value={newCategoryItem.url}
              onChange={(e) => setNewCategoryItem({...newCategoryItem, url: e.target.value})}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
