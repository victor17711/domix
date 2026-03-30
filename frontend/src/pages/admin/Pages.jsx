import React from 'react';
import { FileText } from 'lucide-react';

const Pages = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">Gestionare Pagini</h2>
        <p className="text-teal-100">Creează și editează paginile site-ului</p>
      </div>

      {/* Empty State */}
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-gray-100">
        <FileText className="w-24 h-24 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-900 mb-3">În Curând</h3>
        <p className="text-gray-600 mb-6">Funcționalitatea de gestionare pagini va fi disponibilă în curând.</p>
        <p className="text-sm text-gray-500">Aici vei putea crea și edita pagini statice precum Despre Noi, Politica de Confidențialitate, Termeni și Condiții, etc.</p>
      </div>
    </div>
  );
};

export default Pages;
