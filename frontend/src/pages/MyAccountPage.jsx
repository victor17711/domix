import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Shield,
  LogOut,
  ChevronRight,
  Package,
  BadgeCheck,
  Clock3,
  Truck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from '../hooks/use-toast';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const MyAccountPage = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);

      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('authToken');

      const response = await axios.get(`${API}/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);

      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('authToken');

      await axios.put(`${API}/auth/me`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      toast({
        title: 'Succes',
        description: 'Datele contului au fost actualizate.'
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Eroare',
        description:
          error.response?.data?.detail ||
          'Nu s-au putut actualiza datele contului.',
        variant: 'destructive'
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const completedOrders = orders.filter(
      (order) => order.status === 'delivered'
    ).length;
    const pendingOrders = orders.filter(
      (order) =>
        order.status === 'pending' || order.status === 'processing'
    ).length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.total || 0),
      0
    );

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalSpent
    };
  }, [orders]);

  const menuItems = [
    { id: 'profile', label: 'Date personale', icon: User },
    { id: 'orders', label: 'Istoric comenzi', icon: ShoppingBag },
    { id: 'addresses', label: 'Adrese', icon: MapPin },
    { id: 'security', label: 'Securitate', icon: Shield }
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-orange-100 text-orange-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered':
        return 'Livrată';
      case 'shipped':
        return 'Expediată';
      case 'processing':
        return 'În procesare';
      case 'pending':
        return 'În așteptare';
      case 'cancelled':
        return 'Anulată';
      default:
        return status || 'Necunoscut';
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HERO */}
      <div className="relative bg-gradient-to-r from-teal-600 to-teal-700 text-white py-14">
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-10 h-10" />
            <h1 className="text-3xl md:text-4xl font-bold">Contul meu</h1>
          </div>
          <p className="text-teal-100">
            Gestionează datele personale și comenzile tale
          </p>
        </div>
      </div>

      {/* BREADCRUMB */}
      <div className="bg-white border-b">
        <div className="w-full px-4 md:px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link to="/" className="hover:text-teal-600 transition">
              Acasă
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">Contul meu</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 md:px-6 py-6 md:py-8">
        {/* STATS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total comenzi</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalOrders}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                <Package className="w-6 h-6 text-teal-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Comenzi livrate</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.completedOrders}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                <BadgeCheck className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">În procesare</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.pendingOrders}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center">
                <Clock3 className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total cheltuit</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.totalSpent.toFixed(0)} MDL
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* SIDEBAR */}
          <aside className="bg-white rounded-2xl border border-gray-200 p-5 h-fit">
            <div className="pb-5 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xl font-bold">
                {user?.firstName?.[0] || user?.email?.[0] || 'U'}
              </div>

              <div className="mt-4">
                <div className="text-lg font-bold text-gray-900">
                  {user?.firstName || ''} {user?.lastName || ''}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {user?.email}
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${
                      activeTab === item.id
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.3} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" strokeWidth={2.3} />
                <span className="font-semibold">Ieșire din cont</span>
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="bg-white rounded-2xl border border-gray-200 p-5 md:p-8">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Date personale
                </h2>
                <p className="text-gray-500 mb-6">
                  Actualizează informațiile contului tău
                </p>

                <form onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Prenume
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Nume
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Telefon
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="+373..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Adresă
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Oraș
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Cod poștal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 transition"
                    >
                      {savingProfile ? 'Se salvează...' : 'Salvează modificările'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Istoric comenzi
                </h2>
                <p className="text-gray-500 mb-6">
                  Vezi toate comenzile plasate
                </p>

                {ordersLoading ? (
                  <div className="py-10 text-center text-gray-500">
                    Se încarcă comenzile...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Nu ai comenzi încă
                    </h3>
                    <p className="text-gray-600">
                      Când vei plasa comenzi, ele vor apărea aici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order.id || order._id}
                        className="rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition"
                      >
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              Comanda #{order.id || order._id}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {order.createdAt
                                ? new Date(order.createdAt).toLocaleDateString('ro-RO')
                                : 'Data indisponibilă'}
                            </div>
                          </div>

                          <div className="text-sm text-gray-600">
                            {order.items?.length || 0} produse
                          </div>

                          <div className="font-bold text-gray-900">
                            {Number(order.total || 0).toFixed(0)} MDL
                          </div>

                          <div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Adrese
                </h2>
                <p className="text-gray-500 mb-6">
                  Gestionează adresele folosite la comandă
                </p>

                <div className="rounded-2xl border border-gray-200 p-5">
                  <div className="font-semibold text-gray-900 mb-3">
                    Adresa principală
                  </div>

                  {formData.address || formData.city || formData.postalCode ? (
                    <div className="text-gray-600 space-y-1">
                      {formData.address && <div>{formData.address}</div>}
                      <div>
                        {formData.city} {formData.postalCode}
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      Nu există încă o adresă salvată.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Securitate
                </h2>
                <p className="text-gray-500 mb-6">
                  Pentru schimbarea parolei poți folosi fluxul de resetare din autentificare.
                </p>

                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                  <div className="font-semibold text-gray-900 mb-2">
                    Email cont
                  </div>
                  <div className="text-gray-600">{user?.email}</div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;