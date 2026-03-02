import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setStep } from '../../store/slices/checkoutSlice';
import { createTransaction, pollTransactionStatus } from '../../store/slices/transactionSlice';
import { setTransactionId } from '../../store/slices/checkoutSlice';
import { formatCOP } from '../../utils/formatCurrency';
import type { RootState } from '../../store';

const BASE_FEE = 500000;
const DELIVERY_FEE = 1000000;

export default function SummaryBackdrop() {
  const dispatch = useAppDispatch();
  const { productId, quantity, customerData, deliveryData, cardToken, acceptanceToken } =
    useAppSelector((state: RootState) => state.checkout);
  const product = useAppSelector((state: RootState) =>
    state.products.items.find((p) => p.id === productId),
  );
  const [processing, setProcessing] = useState(false);
  const [visible] = useState(true);

  if (!product) return null;

  const subtotal = product.price * quantity;
  const total = subtotal + BASE_FEE + DELIVERY_FEE;

  const handlePay = async () => {
    if (!cardToken || !acceptanceToken) return;
    setProcessing(true);
    try {
      const result = await dispatch(
        createTransaction({
          productId, quantity, customerData,
          deliveryData: {
            ...deliveryData,
            recipientName: deliveryData.recipientName || customerData.fullName,
            phone: deliveryData.phone || customerData.phone,
          },
          cardToken, acceptanceToken,
        }),
      ).unwrap();
      dispatch(setTransactionId(result.id));
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        const pollResult = await dispatch(pollTransactionStatus(result.id)).unwrap();
        if (pollResult.status !== 'PENDING' || attempts >= 10) {
          clearInterval(poll);
          dispatch(setStep(4));
          setProcessing(false);
        }
      }, 2000);
    } catch {
      dispatch(setStep(4));
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(30,30,50,0.95) 0%, rgba(15,15,25,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 -10px 60px rgba(0,0,0,0.3), 0 0 40px rgba(99, 102, 241, 0.1)',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-10 h-10 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80/1a1a2e/6366f1?text=$'; }}
              />
            </div>
            <div>
              <h2 className="text-lg font-bold" style={{ color: '#fff' }}>Resumen de pago</h2>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{product.name}</p>
            </div>
          </div>

          {/* Price breakdown */}
          <div
            className="rounded-2xl p-4 mb-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {product.name} × {quantity}
                </span>
                <span className="text-sm font-medium" style={{ color: '#fff' }}>{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Tarifa base</span>
                <span className="text-sm font-medium" style={{ color: '#fff' }}>{formatCOP(BASE_FEE)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" /></svg>
                  Envío
                </span>
                <span className="text-sm font-medium" style={{ color: '#fff' }}>{formatCOP(DELIVERY_FEE)}</span>
              </div>
              <div
                className="pt-3 mt-3 flex justify-between items-center"
                style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="font-bold" style={{ color: '#fff' }}>Total</span>
                <span
                  className="text-xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #a5b4fc, #6366f1)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {formatCOP(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Security note */}
          <div className="flex items-center gap-2 mb-6 px-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(74, 222, 128, 0.7)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Pago seguro · Tus datos están encriptados
            </p>
          </div>

          {/* Actions */}
          {processing ? (
            <div className="text-center py-6">
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div
                  className="w-16 h-16 rounded-full border-4 border-transparent"
                  style={{
                    borderTopColor: '#6366f1',
                    borderRightColor: '#8b5cf6',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
              </div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Procesando tu pago...
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                No cierres esta ventana
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handlePay}
                className="w-full py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#fff',
                  fontSize: '15px',
                  boxShadow: '0 4px 20px rgba(34, 197, 94, 0.3)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(34, 197, 94, 0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(34, 197, 94, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Pagar {formatCOP(total)}
              </button>
              <button
                onClick={() => dispatch(setStep(2))}
                className="w-full py-2 text-sm transition-colors cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.4)', background: 'transparent', border: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                ← Volver a editar
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}