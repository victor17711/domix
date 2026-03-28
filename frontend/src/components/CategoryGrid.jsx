import React from 'react';
import { categories } from '../data/mockData';
import { Link } from 'react-router-dom';

const CategoryGrid = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition">{category.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
              <p className="text-sm text-gray-500">{category.itemCount} Items</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
