import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, Home } from 'lucide-react';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-100 shadow-lg">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Comanda Plasată cu Succes!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Mulțumim pentru comandă! Vei primi un email de confirmare în curând.
          </p>

          <div className="bg-teal-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <Package className="w-6 h-6 text-teal-600" />
              <h3 className="text-lg font-bold text-gray-900">Ce urmează?</h3>
            </div>
            <p className="text-gray-700">
              Comanda ta va fi procesată în 24 de ore. Vei primi un SMS cu detaliile de livrare.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-teal-600 text-white px-8 py-4 rounded-xl hover:bg-teal-700 transition font-semibold"
            >
              <Home className="w-5 h-5" />
              Înapoi la Acasă
            </Link>
            <Link
              to="/account/orders"
              className="inline-flex items-center justify-center gap-2 border-2 border-teal-600 text-teal-600 px-8 py-4 rounded-xl hover:bg-teal-50 transition font-semibold"
            >
              Vezi Comenzile Mele
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
