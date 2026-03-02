import { useState } from 'react';
import { useAppSelector } from './hooks/useAppDispatch';
import { useAppDispatch } from './hooks/useAppDispatch';
import { setCardToken, setAcceptanceToken, setStep } from './store/slices/checkoutSlice';
import ProductPage from './components/product/ProductPage';
import CheckoutModal from './components/checkout/CheckoutModal';
import SummaryBackdrop from './components/summary/SummaryBackdrop';
import TransactionStatus from './components/status/TransactionStatus';
import { getPublicConfig, getAcceptanceToken, tokenizeCard } from './services/wompiService';
import type { RootState } from './store';
import type { CardData } from './types';

function App() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector((state: RootState) => state.checkout.currentStep);
  const [tokenizing, setTokenizing] = useState(false);

  const handleCardDataReady = async (cardData: CardData) => {
    setTokenizing(true);
    try {
      const config = await getPublicConfig();
      const acceptanceToken = await getAcceptanceToken(config.sandboxUrl, config.publicKey);
      dispatch(setAcceptanceToken(acceptanceToken));
      const token = await tokenizeCard(config.sandboxUrl, config.publicKey, {
        number: cardData.number.replace(/\s/g, ''),
        cvc: cardData.cvc,
        exp_month: cardData.expMonth,
        exp_year: cardData.expYear,
        card_holder: cardData.cardHolder,
      });
      dispatch(setCardToken(token));
    } catch {
      dispatch(setStep(2));
    } finally {
      setTokenizing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {currentStep === 1 && <ProductPage />}
      {currentStep === 2 && <CheckoutModal onCardDataReady={handleCardDataReady} />}
      {currentStep === 3 && <SummaryBackdrop />}
      {currentStep === 4 && <TransactionStatus />}

      {tokenizing && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
        >
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div
                className="w-20 h-20 rounded-full border-4 border-transparent"
                style={{
                  borderTopColor: '#6366f1',
                  borderRightColor: '#8b5cf6',
                  animation: 'spin 1s linear infinite',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
            </div>
            <p className="text-base font-medium" style={{ color: '#fff' }}>Asegurando tu pago</p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Tokenizando datos de forma segura...
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
      `}</style>
    </div>
  );
}

export default App;