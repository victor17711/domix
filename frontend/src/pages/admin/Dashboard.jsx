import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Package, Users, ShoppingCart, TrendingUp, AlertCircle, DollarSign, Calendar } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { getAuthHeaders } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('today');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/dashboard/stats`, getAuthHeaders());
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-600"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Utilizatori', value: stats?.totalUsers || 0, icon: Users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { title: 'Total Produse', value: stats?.totalProducts || 0, icon: Package, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-600' },
    { title: 'Total Comenzi', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' },
    { title: 'Venit Total', value: `${(stats?.totalRevenue || 0).toFixed(2)} MDL`, icon: DollarSign, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', textColor: 'text-yellow-600' },
    { title: 'Comenzi în Așteptare', value: stats?.pendingOrders || 0, icon: AlertCircle, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-600' },
    { title: 'Stoc Redus', value: stats?.lowStockProducts || 0, icon: TrendingUp, color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', textColor: 'text-red-600' }
  ];

  // Mock data for charts
  const salesData = [
    { day: 'Lun', sales: 4500 },
    { day: 'Mar', sales: 5200 },
    { day: 'Mie', sales: 4800 },
    { day: 'Joi', sales: 6100 },
    { day: 'Vin', sales: 7300 },
    { day: 'Sâm', sales: 8200 },
    { day: 'Dum', sales: 7800 }
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Date Filter */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2">Bine ai revenit! 👋</h2>
            <p className="text-teal-100">Aici este o prezentare generală a magazinului DOMIX</p>
          </div>
          <div className="flex items-center gap-3 bg-white/20 rounded-xl px-4 py-2">
            <Calendar className="w-5 h-5" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent border-none text-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="today" className="text-gray-900">Astăzi</option>
              <option value="week" className="text-gray-900">Săptămâna aceasta</option>
              <option value="month" className="text-gray-900">Luna aceasta</option>
              <option value="year" className="text-gray-900">Anul acesta</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 border-2 border-gray-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Sales */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Vânzări Săptămânale</h3>
          <div className="space-y-4">
            {salesData.map((data, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 text-sm font-semibold text-gray-600">{data.day}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full flex items-center justify-end pr-3 text-white text-sm font-bold transition-all duration-500"
                    style={{ width: `${(data.sales / maxSales) * 100}%` }}
                  >
                    {data.sales} MDL
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart - Orders Trend */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Tendință Comenzi</h3>
          <div className="relative h-64">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid lines */}
              <line x1="0" y1="50" x2="400" y2="50" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="100" x2="400" y2="100" stroke="#e5e7eb" strokeWidth="1" />
              <line x1="0" y1="150" x2="400" y2="150" stroke="#e5e7eb" strokeWidth="1" />
              
              {/* Line */}
              <polyline
                points="50,120 100,80 150,100 200,60 250,70 300,40 350,50"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Area under line */}
              <polygon
                points="50,120 100,80 150,100 200,60 250,70 300,40 350,50 350,200 50,200"
                fill="url(#areaGradient)"
              />
              
              {/* Points */}
              <circle cx="50" cy="120" r="5" fill="#0d9488" />
              <circle cx="100" cy="80" r="5" fill="#0d9488" />
              <circle cx="150" cy="100" r="5" fill="#0d9488" />
              <circle cx="200" cy="60" r="5" fill="#0d9488" />
              <circle cx="250" cy="70" r="5" fill="#0d9488" />
              <circle cx="300" cy="40" r="5" fill="#0d9488" />
              <circle cx="350" cy="50" r="5" fill="#0d9488" />
              
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0d9488" stopOpacity="0.05" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between mt-4 text-xs text-gray-500 font-semibold">
              <span>Lun</span>
              <span>Mar</span>
              <span>Mie</span>
              <span>Joi</span>
              <span>Vin</span>
              <span>Sâm</span>
              <span>Dum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-teal-600" />
            Statistici Rapide
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total Utilizatori</span>
              <span className="text-2xl font-bold text-teal-600">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total Produse</span>
              <span className="text-2xl font-bold text-teal-600">{stats?.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-700 font-medium">Total Comenzi</span>
              <span className="text-2xl font-bold text-teal-600">{stats?.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border-2 border-teal-200">
              <span className="text-gray-700 font-bold">Venit Total</span>
              <span className="text-2xl font-bold text-green-600">{(stats?.totalRevenue || 0).toFixed(2)} MDL</span>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            Alerte & Notificări
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
              <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Comenzi în Așteptare</p>
                <p className="text-sm text-gray-600">{stats?.pendingOrders || 0} comenzi așteaptă procesarea</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Alertă Stoc Redus</p>
                <p className="text-sm text-gray-600">{stats?.lowStockProducts || 0} produse cu stoc redus</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <TrendingUp className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-gray-900">Performanță Bună</p>
                <p className="text-sm text-gray-600">Vânzările au crescut cu 15% {dateRange === 'week' ? 'săptămâna aceasta' : dateRange === 'month' ? 'luna aceasta' : 'astăzi'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
