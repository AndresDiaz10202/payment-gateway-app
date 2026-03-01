import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setStep } from '../../store/slices/checkoutSlice';
import { createTransaction, pollTransactionStatus } from '../../store/slices/transactionSlice';
import { setTransactionId } from '../../store/slices/checkoutSlice';
import { formatCOP } from '../../utils/formatCurrency';
import Spinner from '../common/Spinner';
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

  if (!product) return null;

  const subtotal = product.price * quantity;
  const total = subtotal + BASE_FEE + DELIVERY_FEE;

  const handlePay = async () => {
    if (!cardToken || !acceptanceToken) return;
    setProcessing(true);

    try {
      const result = await dispatch(
        createTransaction({
          productId,
          quantity,
          customerData,
          deliveryData: {
            ...deliveryData,
            recipientName: deliveryData.recipientName || customerData.fullName,
            phone: deliveryData.phone || customerData.phone,
          },
          cardToken,
          acceptanceToken,
        }),
      ).unwrap();

      dispatch(setTransactionId(result.id));

      // Polling cada 2 segundos, máximo 10 intentos
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
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de pago</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{product.name} x{quantity}</span>
            <span className="text-gray-800 font-medium">{formatCOP(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tarifa base</span>
            <span className="text-gray-800 font-medium">{formatCOP(BASE_FEE)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Envío</span>
            <span className="text-gray-800 font-medium">{formatCOP(DELIVERY_FEE)}</span>
          </div>
          <hr className="border-gray-200" />
          <div className="flex justify-between">
            <span className="text-gray-800 font-bold">Total</span>
            <span className="text-blue-600 font-bold text-lg">{formatCOP(total)}</span>
          </div>
        </div>

        {processing ? (
          <div className="text-center">
            <Spinner />
            <p className="text-sm text-gray-500 mt-2">Procesando pago...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              onClick={handlePay}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Pagar {formatCOP(total)}
            </button>
            <button
              onClick={() => dispatch(setStep(2))}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              Volver
            </button>
          </div>
        )}
      </div>
    </div>
  );
}