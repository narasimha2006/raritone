'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ShoppingBag, Shield, Zap, Clock, Star, TrendingUp, Mail, Phone, MapPin, Heart, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SearchOverlay from '@/components/SearchOverlay';
import ChatWidget from '@/components/ChatWidget';
import ProductModal from '@/components/ProductModal';
import AddToCartToast from '@/components/AddToCartToast';
import ButterflyScene from '@/components/ButterflyScene';
import LatestArrivalsCarousel from '@/components/LatestArrivalsCarousel';
import { useToast } from '@/components/ToastContainer';
import { useAuth } from '@/contexts/AuthContext';
import { addToCart } from '@/lib/user';

const Index = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showCartToast, setShowCartToast] = useState(false);
  const [cartToastItem, setCartToastItem] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, refreshCart, addToLocalCart } = useAuth();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load wishlist
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  // Categories (only 3 as requested)
  const categories = [
    { 
      name: "T-Shirts", 
      image: "Raritone Collection/Bold vibe Oversize Tshirt.jpg", 
      count: "15 Items", 
      category: "Tops" 
    },
    { 
      name: "Hoodies", 
      image: "Raritone Collection/Hoddie1(F).jpg", 
      count: "8 Items", 
      category: "Outerwear" 
    },
    { 
      name: "Premium", 
      image: "Raritone Collection/Kiss me again.jpeg", 
      count: "12 Items", 
      category: "Premium" 
    }
  ];

  // Models wearing collection data
  const modelsCollection = [
    {
      id: 1,
      name: "Urban Streetwear",
      price: 2999,
      image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Oversized Hoodie + Cargo Pants"
    },
    {
      id: 2,
      name: "Minimalist Chic",
      price: 3499,
      image: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Classic Tee + Tailored Jeans"
    },
    {
      id: 3,
      name: "Evening Elegance",
      price: 5999,
      image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Silk Dress + Statement Accessories"
    },
    {
      id: 4,
      name: "Casual Comfort",
      price: 1999,
      image: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Cotton Tee + Relaxed Fit Jeans"
    },
    {
      id: 5,
      name: "Business Casual",
      price: 4499,
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop",
      outfit: "Blazer + Chinos + Oxford Shirt"
    }
  ];

  // Customer Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Priya Sharma",
      rating: 5,
      comment: "The AI body scan is incredible! Perfect fit every time.",
      avatar: "PS"
    },
    {
      id: 2,
      name: "Arjun Patel",
      rating: 5,
      comment: "Amazing quality and the virtual try-on saved me so much time.",
      avatar: "AP"
    },
    {
      id: 3,
      name: "Sneha Reddy",
      rating: 5,
      comment: "Love the personalized recommendations. Best fashion app!",
      avatar: "SR"
    },
    {
      id: 4,
      name: "Vikram Singh",
      rating: 5,
      comment: "Revolutionary technology. Never buying clothes without this again.",
      avatar: "VS"
    }
  ];

  // Navigate to catalog with category filter
  const handleCategoryClick = (category: string) => {
    navigate(`/catalog?category=${encodeURIComponent(category)}`);
  };

  // Handle add to cart from modal
  const handleAddToCart = async (product: any, quantity: number, size?: string, color?: string) => {
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      size,
      imageURL: product.image
    };

    if (user) {
      try {
        await addToCart(user.uid, cartItem);
        await refreshCart();
      } catch (error) {
        console.error('Error adding to cart:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to add item to cart. Please try again.'
        });
        return;
      }
    } else {
      addToLocalCart(cartItem);
    }

    setCartToastItem(cartItem);
    setShowCartToast(true);
  };

  // Handle add to wishlist
  const handleAddToWishlist = (productId: string) => {
    const currentWishlist = [...wishlist];
    if (!currentWishlist.includes(productId)) {
      currentWishlist.push(productId);
      setWishlist(currentWishlist);
      localStorage.setItem('wishlist', JSON.stringify(currentWishlist));
      
      window.dispatchEvent(new Event('wishlistUpdated'));
      
      showToast({
        type: 'success',
        title: 'Added to Wishlist',
        message: 'Item has been saved to your wishlist!'
      });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--main-bg)' }}>
      {/* Navigation */}
      <Navbar 
        onSearchOpen={() => setIsSearchOpen(true)}
        onCartOpen={() => {}}
      />

      {/* ENHANCED HERO SECTION */}
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center">
        {/* 3D Butterfly Background */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: 'scale(1.4) translateY(-15vh)', zIndex: 1 }}>
          <ButterflyScene />
        </div>
        
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" style={{ zIndex: 2 }} />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-8" style={{ zIndex: 3 }}>
          <div className="p-8 sm:p-12 lg:p-16">
            <div className="mb-8">
              <img
                src="/IMG-20250305-WA0003-removebg-preview.png"
                alt="RARITONE"
                className="mx-auto w-full max-w-xs sm:max-w-2xl h-auto luxury-float"
                style={{ 
                  filter: 'drop-shadow(0 0 50px rgba(148, 137, 121, 0.8)) brightness(1.3)',
                }}
              />
            </div>

            <h1 className="hero-title mb-6">
              Fashion Meets Technology
            </h1>

            <p className="hero-subtitle font-light mb-16 opacity-90 max-w-2xl mx-auto">
              Experience perfect-fit fashion with our revolutionary AI body scanning technology. 
              Discover your style with precision and confidence.
            </p>

            {/* Enhanced CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                className="btn-primary font-bold flex items-center space-x-3 rounded-full justify-center w-full max-w-xs sm:min-w-[260px] px-8 py-4 text-base luxury-glow"
                onClick={() => navigate('/scan')}
              >
                <Camera size={24} />
                <span>Start Body Scan</span>
              </button>
              
              <button
                className="btn-secondary font-bold flex items-center space-x-3 rounded-full justify-center w-full max-w-xs sm:min-w-[260px] px-8 py-4 text-base"
                onClick={() => navigate('/catalog')}
              >
                <ShoppingBag size={24} />
                <span>Browse Collection</span>
              </button>
            </div>

            {/* Enhanced Privacy Notice */}
            <div className="max-w-lg mx-auto">
              <p className="text-sm px-6 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--secondary-bg)]/50 backdrop-blur-md text-[var(--accent-color)]">
                🔒 Your camera data is processed locally and never stored or shared
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI BODY SCAN BENEFITS SECTION */}
      <section className="section-spacing luxury-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              AI Body Scan Benefits
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Revolutionary technology that ensures perfect fit every time with complete privacy and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* 100% Private */}
            <div className="feature-card hover-lift">
              <Shield size={64} color="var(--accent-color)" className="mx-auto mb-6" />
              <h3 className="feature-title">100% Private</h3>
              <p className="feature-description">
                Body data never stored or sent online. All processing happens locally on your device for complete privacy.
              </p>
            </div>

            {/* 99% Accurate */}
            <div className="feature-card hover-lift">
              <Zap size={64} color="var(--accent-color)" className="mx-auto mb-6" />
              <h3 className="feature-title">99% Accurate</h3>
              <p className="feature-description">
                AI scanning ensures near-perfect micro-fit. Our technology provides the most accurate measurements possible.
              </p>
            </div>

            {/* 30 Second Scan */}
            <div className="feature-card hover-lift">
              <Clock size={64} color="var(--accent-color)" className="mx-auto mb-6" />
              <h3 className="feature-title">30 Second Scan</h3>
              <p className="feature-description">
                Fast scan with only a smartphone camera. Get your perfect measurements in half a minute.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FULL-WIDTH LANDSCAPE IMAGE SECTION */}
      <section className="w-full">
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
          <img
            src="/placeholder-landscape-1.jpg"
            alt="RARITONE Collection"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* SHOP BY CATEGORY SECTION */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              Shop by Category
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Explore our curated collection of premium fashion categories.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {categories.map((category) => (
              <div
                key={category.name}
                className="group cursor-pointer"
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="category-card hover-lift">
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-white/80 text-sm">
                        {category.count}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADDITIONAL LANDSCAPE IMAGE SECTION */}
      <section className="w-full">
        <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
          <img
            src="/placeholder-landscape-2.jpg"
            alt="RARITONE Latest Collection"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* LATEST ARRIVALS SECTION */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              Latest Arrivals
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Discover the newest additions to our premium collection.
            </p>
          </div>

          {/* Full Width Product Showcase with Navigation */}
          <LatestArrivalsCarousel />
        </div>
      </section>

      {/* CUSTOMER REVIEW SLIDER SECTION */}
      <section className="section-spacing overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-[var(--text-primary)]">
              What Our Customers Say
            </h2>
            <p className="hero-subtitle max-w-3xl mx-auto text-lg">
              Join thousands of satisfied customers who love our AI-powered fashion experience.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex space-x-8 animate-slide-left" style={{ width: 'calc(200% + 2rem)' }}>
            {[
              { id: 1, name: "Priya Sharma", rating: 5, comment: "The AI body scan is incredible! Perfect fit every time.", avatar: "PS" },
              { id: 2, name: "Arjun Patel", rating: 5, comment: "Amazing quality and the virtual try-on saved me so much time.", avatar: "AP" },
              { id: 3, name: "Sneha Reddy", rating: 5, comment: "Love the personalized recommendations. Best fashion app!", avatar: "SR" },
              { id: 4, name: "Vikram Singh", rating: 5, comment: "Revolutionary technology. Never buying clothes without this again.", avatar: "VS" },
              { id: 5, name: "Anita Gupta", rating: 5, comment: "Excellent customer service and perfect fit guarantee.", avatar: "AG" },
              { id: 6, name: "Rohit Mehta", rating: 4, comment: "Great quality products and fast delivery.", avatar: "RM" },
              { id: 7, name: "Kavya Iyer", rating: 5, comment: "The size recommendations are always spot on!", avatar: "KI" },
              { id: 8, name: "Amit Kumar", rating: 5, comment: "Best online shopping experience I've ever had.", avatar: "AK" },
              { id: 9, name: "Deepika Rao", rating: 5, comment: "Love how the AI understands my style preferences.", avatar: "DR" },
              { id: 10, name: "Sanjay Verma", rating: 4, comment: "Impressive technology and great customer support.", avatar: "SV" },
              // Duplicate for seamless loop
              { id: 1, name: "Priya Sharma", rating: 5, comment: "The AI body scan is incredible! Perfect fit every time.", avatar: "PS" },
              { id: 2, name: "Arjun Patel", rating: 5, comment: "Amazing quality and the virtual try-on saved me so much time.", avatar: "AP" },
              { id: 3, name: "Sneha Reddy", rating: 5, comment: "Love the personalized recommendations. Best fashion app!", avatar: "SR" },
              { id: 4, name: "Vikram Singh", rating: 5, comment: "Revolutionary technology. Never buying clothes without this again.", avatar: "VS" },
              { id: 5, name: "Anita Gupta", rating: 5, comment: "Excellent customer service and perfect fit guarantee.", avatar: "AG" },
              { id: 6, name: "Rohit Mehta", rating: 4, comment: "Great quality products and fast delivery.", avatar: "RM" },
              { id: 7, name: "Kavya Iyer", rating: 5, comment: "The size recommendations are always spot on!", avatar: "KI" },
              { id: 8, name: "Amit Kumar", rating: 5, comment: "Best online shopping experience I've ever had.", avatar: "AK" },
              { id: 9, name: "Deepika Rao", rating: 5, comment: "Love how the AI understands my style preferences.", avatar: "DR" },
              { id: 10, name: "Sanjay Verma", rating: 4, comment: "Impressive technology and great customer support.", avatar: "SV" }
            ].map((review, index) => (
              <div
                key={`review-${review.id}-${index}`}
                className="flex-shrink-0 w-80 review-card"
              >
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 rounded-full bg-[var(--accent-color)] flex items-center justify-center text-[var(--main-bg)] font-bold text-lg mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-[var(--text-primary)] text-lg">{review.name}</h4>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={18} className="star-rating" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[var(--text-primary)] italic text-base leading-relaxed">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FOOTER SECTION */}
      <footer className="section-spacing border-t-2 border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="luxury-card rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <img
                  src="/IMG-20250305-WA0003-removebg-preview.png"
                  alt="RARITONE"
                  className="h-20 w-auto mb-6"
                />
                <p className="text-[var(--text-primary)] max-w-md leading-relaxed text-base mb-6">
                  Revolutionizing fashion with AI-powered body scanning technology. 
                  Experience perfect fit and personalized style recommendations across India.
                </p>
                <div className="flex space-x-4">
                  {/* Instagram Icon */}
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center hover:bg-[#A69688] transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-[var(--main-bg)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  
                  {/* Facebook Icon */}
                  <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] flex items-center justify-center hover:bg-[#A69688] transition-colors cursor-pointer">
                    <svg className="w-6 h-6 text-[var(--main-bg)]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Quick Links</h3>
                <ul className="space-y-3">
                  <li>
                    <button 
                      onClick={() => navigate('/about')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/privacy')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/returns')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Returns & Exchanges
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/contact')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Contact Us
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => navigate('/reviews')}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors text-base font-medium"
                    >
                      Customer Reviews
                    </button>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail size={20} className="text-[var(--accent-color)]" />
                    <span className="text-[var(--text-primary)] text-base">
                      hello@raritone.in
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={20} className="text-[var(--accent-color)]" />
                    <span className="text-[var(--text-primary)] text-base">
                      +91 98765 43210
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={20} className="text-[var(--accent-color)]" />
                    <span className="text-[var(--text-primary)] text-base">
                      Mumbai, India
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-[var(--border-color)] mt-12 pt-8 text-center">
              <p className="text-[var(--accent-color)] text-base">
                2025 RARITONE. All rights reserved. Powered by AI Fashion Technology. Made in India
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleAddToWishlist}
      />

      {/* Add to Cart Toast */}
      <AddToCartToast
        isOpen={showCartToast}
        onClose={() => setShowCartToast(false)}
        item={cartToastItem}
        onViewCart={() => {
          setShowCartToast(false);
          navigate('/cart');
        }}
        onCheckout={() => {
          setShowCartToast(false);
          navigate('/cart');
        }}
      />

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default Index;