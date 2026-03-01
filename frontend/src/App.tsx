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
      // 1. Obtener public key y sandbox URL del backend
      const config = await getPublicConfig();

      // 2. Obtener acceptance token de Wompi
      const acceptanceToken = await getAcceptanceToken(config.sandboxUrl, config.publicKey);
      dispatch(setAcceptanceToken(acceptanceToken));

      // 3. Tokenizar tarjeta directamente con Wompi (nunca pasa por nuestro backend)
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
    <div className="min-h-screen bg-gray-50">
      {currentStep === 1 && <ProductPage />}

      {currentStep === 2 && <CheckoutModal onCardDataReady={handleCardDataReady} />}

      {currentStep === 3 && <SummaryBackdrop />}

      {currentStep === 4 && <TransactionStatus />}

      {tokenizing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Procesando datos de tarjeta...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;