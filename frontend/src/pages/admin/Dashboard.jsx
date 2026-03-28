import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import axios from 'axios';
import { Package, Users, ShoppingCart, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';

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
    return <div className="text-center py-12">Loading...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: Package,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'Total Revenue',
      value: `$${stats?.totalRevenue?.toFixed(2) || 0}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    {
      title: 'Pending Orders',
      value: stats?.pendingOrders || 0,
      icon: AlertCircle,
      color: 'bg-orange-500',
      textColor: 'text-orange-500'
    },
    {
      title: 'Low Stock Products',
      value: stats?.lowStockProducts || 0,
      icon: TrendingUp,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    }
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to your Sellzy admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Users</span>
              <span className="font-bold text-gray-900">{stats?.totalUsers || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Products</span>
              <span className="font-bold text-gray-900">{stats?.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Total Orders</span>
              <span className="font-bold text-gray-900">{stats?.totalOrders || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-bold text-green-600">${stats?.totalRevenue?.toFixed(2) || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Alerts</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Pending Orders</p>
                <p className="text-sm text-gray-600">{stats?.pendingOrders || 0} orders waiting for processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Low Stock Alert</p>
                <p className="text-sm text-gray-600">{stats?.lowStockProducts || 0} products with low inventory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
