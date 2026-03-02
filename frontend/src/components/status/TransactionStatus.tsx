import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setStep, resetCheckout } from '../../store/slices/checkoutSlice';
import { resetTransaction } from '../../store/slices/transactionSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { formatCOP } from '../../utils/formatCurrency';
import type { RootState } from '../../store';

const STATUS_CONFIG = {
  APPROVED: {
    gradient: 'linear-gradient(135deg, #059669, #10b981, #34d399)',
    icon: '✓',
    title: '¡Pago exitoso!',
    subtitle: 'Tu compra ha sido procesada correctamente',
    accent: '#34d399',
    particle: '#6ee7b7',
  },
  DECLINED: {
    gradient: 'linear-gradient(135deg, #dc2626, #ef4444, #f87171)',
    icon: '✕',
    title: 'Pago rechazado',
    subtitle: 'La transacción no pudo ser procesada',
    accent: '#f87171',
    particle: '#fca5a5',
  },
  ERROR: {
    gradient: 'linear-gradient(135deg, #d97706, #f59e0b, #fbbf24)',
    icon: '!',
    title: 'Error en el pago',
    subtitle: 'Ocurrió un problema al procesar tu pago',
    accent: '#fbbf24',
    particle: '#fde68a',
  },
  PENDING: {
    gradient: 'linear-gradient(135deg, #4f46e5, #6366f1, #818cf8)',
    icon: '⏳',
    title: 'Pago pendiente',
    subtitle: 'Tu transacción está siendo procesada',
    accent: '#818cf8',
    particle: '#a5b4fc',
  },
};

export default function TransactionStatus() {
  const dispatch = useAppDispatch();
  const transaction = useAppSelector((state: RootState) => state.transaction.current);
  const [phase, setPhase] = useState(0); // 0: fullscreen color, 1: reveal content, 2: show details

  useEffect(() => {
    setTimeout(() => setPhase(1), 800);
    setTimeout(() => setPhase(2), 1500);
  }, []);

  const handleBackToStore = () => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
    dispatch(fetchProducts());
    dispatch(setStep(1));
  };

  if (!transaction) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="text-center p-8">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-xl mb-2 font-bold" style={{ color: '#fff' }}>Error</p>
          <p className="mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>No se encontró la transacción</p>
          <button onClick={handleBackToStore}
            className="px-8 py-3 rounded-xl font-semibold cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}>
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const config = STATUS_CONFIG[transaction.status] || STATUS_CONFIG.ERROR;

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#0a0a0a' }}>
      {/* Fullscreen color splash */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: config.gradient,
          opacity: phase === 0 ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
        {transaction.status === 'APPROVED' && Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              background: i % 3 === 0 ? config.particle : i % 3 === 1 ? '#fbbf24' : '#fff',
              left: `${Math.random() * 100}%`,
              top: '-10px',
              opacity: phase >= 1 ? 0.8 : 0,
              animation: phase >= 1 ? `confetti ${2 + Math.random() * 3}s ease-out ${Math.random() * 0.5}s forwards` : 'none',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-30 min-h-screen flex items-center justify-center p-4">
        <div
          className="w-full max-w-md text-center"
          style={{
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Status icon */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: `${config.gradient}`,
              boxShadow: `0 0 60px ${config.accent}40`,
              animation: phase >= 1 ? 'popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
            }}
          >
            <span className="text-4xl font-bold text-white">{config.icon}</span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-black mb-2"
            style={{ color: '#fff', fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}
          >
            {config.title}
          </h1>
          <p className="text-base mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {config.subtitle}
          </p>

          {/* Transaction details card */}
          <div
            className="rounded-2xl p-5 mb-8 text-left"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Referencia</span>
                <span className="text-xs font-mono px-2 py-1 rounded-lg" style={{ color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.05)' }}>
                  {transaction.reference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Total cobrado</span>
                <span className="font-bold" style={{ color: '#fff' }}>{formatCOP(transaction.totalInCents)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Estado</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    background: `${config.accent}20`,
                    color: config.accent,
                  }}
                >
                  {transaction.status}
                </span>
              </div>
              {transaction.externalTransactionId && (
                <div className="flex justify-between items-center">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>ID Transacción</span>
                  <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {transaction.externalTransactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div
            style={{
              opacity: phase >= 2 ? 1 : 0,
              transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}
          >
            <button
              onClick={handleBackToStore}
              className="w-full py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Volver a la tienda
            </button>
            {transaction.status === 'DECLINED' && (
              <button
                onClick={() => {
                  dispatch(resetTransaction());
                  dispatch(setStep(2));
                }}
                className="w-full py-3 mt-3 text-sm cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none' }}
              >
                Intentar con otra tarjeta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes popIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}