import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LatestArrivalsCarousel: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    { id: 1, name: "Bold Vibe Oversize T-Shirt", price: 696, image: "Raritone Collection/Bold vibe Oversize Tshirt.jpg" },
    { id: 2, name: "Raritone Hoodie", price: 1043, image: "Raritone Collection/Hoddie1(F).jpg" },
    { id: 3, name: "Kiss Me Again Oversize T-Shirt", price: 399, image: "Raritone Collection/Kiss me again.jpeg" },
    { id: 4, name: "Minimal Look Oversize T-Shirt", price: 599, image: "Raritone Collection/Minimal look Oversize Tshirt.jpg" }
  ];

  const itemsPerView = 4;
  const maxIndex = Math.max(0, products.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="relative w-full">
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={currentIndex === 0}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentIndex >= maxIndex}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-black/30 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ backdropFilter: 'blur(10px)' }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Products Container */}
      <div className="overflow-hidden px-16">
        <motion.div
          className="flex gap-6"
          animate={{ x: `${-currentIndex * (100 / itemsPerView)}%` }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 cursor-pointer group rounded-2xl overflow-hidden bg-[var(--card-bg)] border border-[var(--border-color)] hover-lift"
              style={{ width: `calc(25% - 18px)` }}
              onClick={() => navigate('/catalog')}
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">{product.name}</h3>
                <p className="text-xl font-bold text-[var(--accent-color)]">₹{product.price}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[var(--accent-color)]' 
                : 'bg-[var(--accent-color)]/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default LatestArrivalsCarousel;