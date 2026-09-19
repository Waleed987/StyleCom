

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from './Card';
import { getInventory } from '../catalog';

function SoftboySeasonSection() {
  const [activeTab, setActiveTab] = useState('men');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [products,setproducts] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const inventoryItems = await getInventory();
        setproducts(inventoryItems);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    }

    fetchItems();
  }, []);
  

  // Responsive items per view
  useEffect(() => {
    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setItemsPerView(1); // Mobile: 1 item
      } else if (width < 1024) {
        setItemsPerView(2); // Tablet: 2 items
      } else if (width < 1280) {
        setItemsPerView(3); // Small desktop: 3 items
      } else {
        setItemsPerView(4); // Large desktop: 4 items
      }
      setCurrentSlide(0); // Reset slide when changing view
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const visibleProducts = products.filter(item => activeTab === 'all' || item.gender === (activeTab === 'men' ? 'male' : 'female'));
  const maxSlides = Math.max(0, visibleProducts.length - itemsPerView);

  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, maxSlides));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="h-auto w-full bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Header */}
      <div className="pt-8 md:pt-16 pb-6 md:pb-8 px-4 md:px-8">
        <h1 className="text-2xl md:text-4xl lg:text-5xl font-light tracking-wide text-gray-900 mb-6 md:mb-8">
          SOFTBOY SEASON
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-4 md:gap-8 mb-6 md:mb-8 flex-wrap">
          <button
            onClick={() => { setActiveTab('men'); setCurrentSlide(0); }}
            className={`px-4 md:px-6 py-2 rounded-full border transition-all duration-300 text-sm md:text-base ${
              activeTab === 'men'
                ? 'bg-black text-white border-black'
                : 'bg-transparent text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            Men's
          </button>
          <button
            onClick={() => { setActiveTab('women'); setCurrentSlide(0); }}
            className={`px-4 md:px-6 py-2 rounded-full border transition-all duration-300 text-sm md:text-base ${
              activeTab === 'women'
                ? 'bg-black text-white border-black'
                : 'bg-transparent text-gray-700 border-gray-300 hover:border-gray-400'
            }`}
          >
            Women's
          </button>
          <button
            onClick={() => { setActiveTab('all'); setCurrentSlide(0); }}
            className={`px-4 md:px-6 py-2 rounded-full border-b-2 transition-all duration-300 text-sm md:text-base ${
              activeTab === 'all'
                ? 'border-black text-black'
                : 'border-transparent text-gray-700 hover:border-gray-300'
            } bg-transparent`}
          >
            Shop All
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex-1 px-4 md:px-8 pb-8 relative">
        {/* Navigation Arrows - Only show if there are slides to navigate */}
        {maxSlides > 0 && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-10 flex gap-2 md:gap-4">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 md:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              disabled={currentSlide >= maxSlides}
              className="p-2 md:p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 md:w-6 md:h-6 text-gray-700" />
            </button>
          </div>
        )}

        {/* Products Grid Container */}
        <div className="overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-6"
            style={{ 
              transform: `translateX(calc(-${currentSlide} * (100% + 24px) / ${itemsPerView}))`,
              width: '100%'
            }}
          >
            {visibleProducts.map((item) => (
              <div 
                key={item._id} 
                className="group cursor-pointer flex-shrink-0"
                style={{ width: `calc((100% - ${(itemsPerView - 1) * 24}px) / ${itemsPerView})` }}
              >
                <Card item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* Slide Indicators */}
        {maxSlides > 0 && (
          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {Array.from({ length: maxSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-black'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SoftboySeasonSection;