import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Package, Users, ShoppingCart, TrendingUp, AlertCircle, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { getAuthHeaders } = useAdmin();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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
    {
      title: 'Total Utilizatori',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Produse',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Total Comenzi',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      trend: '+23%',
      trendUp: true
    },
    {
      title: 'Venit Total',
      value: `${(stats?.totalRevenue || 0).toFixed(2)} MDL`,
      icon: DollarSign,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      trend: '+15%',
      trendUp: true
    },
    {
      title: 'Comenzi în Așteptare',
      value: stats?.pendingOrders || 0,
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Stoc Redus',
      value: stats?.lowStockProducts || 0,
      icon: TrendingUp,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      trend: '+3%',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-2">Bine ai revenit! 👋</h2>
        <p className="text-teal-100">Aici este o prezentare generală a magazinului tău DOMIX</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} p-4 rounded-xl`}>
                  <Icon className={`w-8 h-8 ${stat.textColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.trend}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-md p-6">
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
        <div className="bg-white rounded-2xl shadow-md p-6">
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
                <p className="text-sm text-gray-600">Vânzările au crescut cu 15% luna aceasta</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
