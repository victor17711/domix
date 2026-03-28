import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '../../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoriesManagement = () => {
  const { getAuthHeaders } = useAdmin();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', slug: '', icon: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to fetch categories', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        await axios.put(`${API}/categories/${editingCategory.id}`, formData, getAuthHeaders());
        toast({ title: 'Success', description: 'Category updated successfully!' });
      } else {
        await axios.post(`${API}/categories`, { ...formData, itemCount: 0 }, getAuthHeaders());
        toast({ title: 'Success', description: 'Category created successfully!' });
      }
      
      setShowModal(false);
      setEditingCategory(null);
      setFormData({ name: '', slug: '', icon: '' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: error.response?.data?.detail || 'Failed to save category', variant: 'destructive' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await axios.delete(`${API}/categories/${id}`, getAuthHeaders());
      toast({ title: 'Success', description: 'Category deleted successfully!' });
      fetchCategories();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || ''
    });
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories Management</h2>
          <p className="text-gray-600">Manage product categories</p>
        </div>
        <button
          onClick={() => { setShowModal(true); setEditingCategory(null); setFormData({ name: '', slug: '', icon: '' }); }}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-700 transition"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <div className="text-4xl">{category.icon || '📁'}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">{category.name}</h3>
            <p className="text-sm text-gray-500 mb-3">Slug: {category.slug}</p>
            <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold inline-block">
              {category.itemCount || 0} Products
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="border-b px-6 py-4">
              <h3 className="text-xl font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  placeholder="e.g., womens-clothing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({...formData, icon: e.target.value})}
                  placeholder="e.g., 👗"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingCategory(null); setFormData({ name: '', slug: '', icon: '' }); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;
