import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { sliderData } from '../data/mockData';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderData.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
  };

  const currentItem = sliderData[currentSlide];

  const hasContent =
    currentItem?.badge ||
    currentItem?.title ||
    currentItem?.description ||
    currentItem?.buttonText;

  return (
    <div className="w-full px-4 md:px-6 py-6 md:py-10">
      <div
        className="relative rounded-3xl overflow-hidden h-[520px] md:h-[600px] touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* BACKGROUND */}
        <img
          src={currentItem.image}
          alt={currentItem.title || 'Slide image'}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          draggable="false"
        />

        {/* OVERLAY - doar dacă există conținut */}
        {hasContent && (
          <div className="absolute inset-0 bg-black/40"></div>
        )}

        {/* CONTENT */}
        {hasContent && (
          <div className="relative z-10 h-full flex items-center justify-start px-6 md:px-32">
            <div className="max-w-2xl text-white space-y-4 md:space-y-6 text-left">
              {currentItem.badge && (
                <span className="inline-block text-sm md:text-base font-medium opacity-90">
                  {currentItem.badge}
                </span>
              )}

              {currentItem.title && (
                <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  {currentItem.title}
                </h1>
              )}

              {currentItem.description && (
                <p className="text-sm md:text-lg opacity-90 max-w-[90%] md:max-w-lg">
                  {currentItem.description}
                </p>
              )}

              {currentItem.buttonText && (
                <div className="flex justify-start">
                  <button className="bg-teal-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-full flex items-center gap-2 hover:bg-teal-700 transition group shadow-lg font-semibold text-sm md:text-base">
                    {currentItem.buttonText}
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* NAV - doar desktop */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 bg-black/60 text-white p-4 rounded-full hover:bg-black/80 transition z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 bg-black/60 text-white p-4 rounded-full hover:bg-black/80 transition z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* DOTS */}
        <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/90 px-4 md:px-6 py-2 md:py-3 rounded-full shadow-lg">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                currentSlide === index
                  ? 'bg-teal-600 w-6 h-2 md:w-10 md:h-3'
                  : 'bg-gray-300 w-2 h-2 md:w-3 md:h-3 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;