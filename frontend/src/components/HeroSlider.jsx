import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { sliderData } from '../data/mockData';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);
  };

  return (
    <div className="w-full px-6 py-6">
      <div className="relative bg-yellow-200 rounded-3xl overflow-hidden">
        <div className="w-full px-24 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6 relative z-10">
              <span className="inline-block text-base font-medium text-gray-800">
                {sliderData[currentSlide].badge}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                {sliderData[currentSlide].title}
              </h1>
              <p className="text-gray-800 text-lg max-w-lg">
                {sliderData[currentSlide].description}
              </p>
              <button className="bg-teal-600 text-white px-8 py-4 rounded-full flex items-center gap-2 hover:bg-teal-700 transition group shadow-lg font-semibold">
                Shop Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </button>
            </div>

            {/* Right Image */}
            <div className="relative flex justify-end">
              <img
                src={sliderData[currentSlide].image}
                alt={sliderData[currentSlide].title}
                className="w-full max-w-lg h-[500px] object-cover rounded-2xl"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-full hover:bg-opacity-90 transition z-20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-black bg-opacity-70 text-white p-4 rounded-full hover:bg-opacity-90 transition z-20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots Indicator - Bottom Center */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white bg-opacity-90 px-6 py-3 rounded-full shadow-lg">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                currentSlide === index 
                  ? 'bg-teal-600 w-10 h-3' 
                  : 'bg-gray-300 w-3 h-3 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;
