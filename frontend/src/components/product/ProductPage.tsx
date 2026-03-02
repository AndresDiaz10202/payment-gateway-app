import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProducts } from '../../store/slices/productsSlice';
import { setProductId, setStep } from '../../store/slices/checkoutSlice';
import { formatCOP } from '../../utils/formatCurrency';
import Spinner from '../common/Spinner';
import type { RootState } from '../../store';

const BRANDS = [
  { key: 'all', label: 'Todos', icon: '🔥' },
  { key: 'apple', label: 'Apple', icon: '🍎' },
  { key: 'samsung', label: 'Samsung', icon: '💎' },
  { key: 'xiaomi', label: 'Xiaomi', icon: '🚀' },
];

function detectBrand(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('iphone') || n.includes('macbook') || n.includes('ipad') || n.includes('airpods') || n.includes('apple watch')) return 'apple';
  if (n.includes('galaxy') || n.includes('samsung')) return 'samsung';
  if (n.includes('xiaomi') || n.includes('redmi') || n.includes('poco')) return 'xiaomi';
  return 'other';
}

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state: RootState) => state.products);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    setTimeout(() => setHeroVisible(true), 100);
    setTimeout(() => setCardsVisible(true), 600);
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    let filtered = items;
    if (selectedBrand !== 'all') {
      filtered = filtered.filter((p) => detectBrand(p.name) === selectedBrand);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    return filtered;
  }, [items, selectedBrand, searchQuery]);

  const handleBuy = (productId: string) => {
    dispatch(setProductId(productId));
    dispatch(setStep(2));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #0f0f0f 100%)' }}>
      <Spinner />
    </div>
  );
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* ─── HERO SECTION ─── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 30%, #16213e 60%, #0f0f0f 100%)',
          minHeight: '70vh',
        }}
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: '600px', height: '600px',
              background: 'radial-gradient(circle, #6366f1, transparent)',
              top: '-200px', right: '-100px',
              animation: 'float 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-15"
            style={{
              width: '400px', height: '400px',
              background: 'radial-gradient(circle, #06b6d4, transparent)',
              bottom: '-100px', left: '-50px',
              animation: 'float 10s ease-in-out infinite reverse',
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              width: '300px', height: '300px',
              background: 'radial-gradient(circle, #f59e0b, transparent)',
              top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              animation: 'pulse 6s ease-in-out infinite',
            }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center" style={{ minHeight: '70vh' }}>
          <div
            className="text-center"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase mb-8"
              style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
              }}
            >
              <span style={{ animation: 'pulse 2s infinite' }}>●</span>
              Nuevos lanzamientos 2026
            </div>

            <h1
              className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tight leading-none mb-6"
              style={{
                fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 50%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TechStore
            </h1>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              La tecnología más avanzada del mundo, al alcance de tu mano.
              Apple. Samsung. Xiaomi.
            </p>

            <a
              href="#products"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 50px rgba(99, 102, 241, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.4)';
              }}
            >
              Explorar productos
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            style={{ animation: 'bounce 2s ease-in-out infinite', opacity: 0.3 }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
              <div className="w-1.5 h-3 rounded-full bg-white/50" style={{ animation: 'scrollDown 2s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </div>

      {/* ─── PRODUCTS SECTION ─── */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: '#fff', fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}
          >
            Nuestro catálogo
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>
            {items.length} productos disponibles
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            />
          </div>
        </div>

        {/* Brand filters */}
        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {BRANDS.map((brand) => (
            <button
              key={brand.key}
              onClick={() => setSelectedBrand(brand.key)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
              style={{
                background: selectedBrand === brand.key
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.05)',
                color: selectedBrand === brand.key ? '#fff' : 'rgba(255,255,255,0.5)',
                border: selectedBrand === brand.key
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.1)',
                boxShadow: selectedBrand === brand.key
                  ? '0 4px 20px rgba(99, 102, 241, 0.3)'
                  : 'none',
              }}
            >
              {brand.icon} {brand.label}
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                opacity: cardsVisible ? 1 : 0,
                transform: cardsVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.05}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.3)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(99, 102, 241, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => product.stock > 0 && handleBuy(product.id)}
            >
              {/* Brand badge */}
              <div className="absolute top-3 left-3 z-10">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
                  style={{
                    background: detectBrand(product.name) === 'apple'
                      ? 'rgba(255,255,255,0.1)'
                      : detectBrand(product.name) === 'samsung'
                        ? 'rgba(59, 130, 246, 0.2)'
                        : 'rgba(251, 146, 60, 0.2)',
                    color: detectBrand(product.name) === 'apple'
                      ? '#fff'
                      : detectBrand(product.name) === 'samsung'
                        ? '#93c5fd'
                        : '#fdba74',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {detectBrand(product.name)}
                </span>
              </div>

              {/* Stock badge */}
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-3 right-3 z-10">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}
                  >
                    ¡Últimas {product.stock}!
                  </span>
                </div>
              )}

              {/* Product image */}
              <div
                className="relative h-56 flex items-center justify-center p-6 overflow-hidden"
                style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)' }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x300/1a1a2e/6366f1?text=' + encodeURIComponent(product.name.split(' ')[0]);
                  }}
                />
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                  }}
                />
              </div>

              {/* Product info */}
              <div className="p-5">
                <h3 className="text-base font-bold mb-1.5" style={{ color: '#fff' }}>
                  {product.name}
                </h3>
                <p
                  className="text-xs leading-relaxed mb-4 line-clamp-2"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  {product.description}
                </p>

                <div className="flex items-end justify-between">
                  <div>
                    <p
                      className="text-xl font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {formatCOP(product.price)}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: product.stock > 0 ? 'rgba(74, 222, 128, 0.7)' : 'rgba(248, 113, 113, 0.7)' }}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </p>
                  </div>
                  <button
                    disabled={product.stock === 0}
                    className="flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300"
                    style={{
                      background: product.stock > 0 ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                      opacity: product.stock > 0 ? 1 : 0.3,
                      boxShadow: product.stock > 0 ? '0 4px 15px rgba(99, 102, 241, 0.3)' : 'none',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (product.stock > 0) handleBuy(product.id);
                    }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* ─── FOOTER ─── */}
      <footer
        className="text-center py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)' }}
      >
        <p className="text-sm">TechStore © 2026 — Todos los derechos reservados</p>
      </footer>

      {/* ─── CSS ANIMATIONS ─── */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.2; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(10px); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(8px); opacity: 0; }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}