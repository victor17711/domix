import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CategoryGrid = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      // Filter only parent categories (those without parentId)
      const parentCategories = response.data.filter(cat => !cat.parentId);
      setCategories(parentCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-8">
        <div className="w-full px-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white">
      <div className="w-full px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explorează Categoriile</h2>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 }
          }}
          className="category-carousel"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id}>
              <Link
                to={`/category/${category.slug}`}
                className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition group block h-full"
              >
                {category.image ? (
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center group-hover:scale-110 transition">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : category.icon ? (
                  <div className="text-5xl mb-3 group-hover:scale-110 transition">{category.icon}</div>
                ) : (
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center group-hover:scale-110 transition">
                    <span className="text-2xl font-bold text-teal-600">{category.name.charAt(0)}</span>
                  </div>
                )}
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.itemCount || 0} Produse</p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .category-carousel :global(.swiper-button-next),
        .category-carousel :global(.swiper-button-prev) {
          color: #0d9488;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .category-carousel :global(.swiper-button-next):after,
        .category-carousel :global(.swiper-button-prev):after {
          font-size: 18px;
        }
        
        .category-carousel :global(.swiper-pagination-bullet) {
          background: #0d9488;
        }
        
        .category-carousel :global(.swiper-pagination) {
          bottom: -5px;
        }
      `}</style>
    </section>
  );
};

export default CategoryGrid;
