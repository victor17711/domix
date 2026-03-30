import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import axios from 'axios';
import 'swiper/css';
import 'swiper/css/navigation';

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
          modules={[Navigation, Autoplay]}
          spaceBetween={16}
          slidesPerView={2}
          navigation
          speed={800}
          autoplay={{ 
            delay: 4000, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          loop={true}
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
          color: white;
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          box-shadow: 0 4px 15px rgba(13, 148, 136, 0.4);
          transition: all 0.3s ease;
        }
        
        .category-carousel :global(.swiper-button-next):hover,
        .category-carousel :global(.swiper-button-prev):hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(13, 148, 136, 0.6);
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
        }
        
        .category-carousel :global(.swiper-button-next):after,
        .category-carousel :global(.swiper-button-prev):after {
          font-size: 20px;
          font-weight: bold;
        }
        
        .category-carousel :global(.swiper-button-disabled) {
          opacity: 0.3;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default CategoryGrid;
