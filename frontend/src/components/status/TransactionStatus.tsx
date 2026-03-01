import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setStep, resetCheckout } from '../../store/slices/checkoutSlice';
import { resetTransaction } from '../../store/slices/transactionSlice';
import { fetchProducts } from '../../store/slices/productsSlice';
import { formatCOP } from '../../utils/formatCurrency';
import type { RootState } from '../../store';

export default function TransactionStatus() {
  const dispatch = useAppDispatch();
  const transaction = useAppSelector((state: RootState) => state.transaction.current);

  const handleBackToStore = () => {
    dispatch(resetCheckout());
    dispatch(resetTransaction());
    dispatch(fetchProducts());
    dispatch(setStep(1));
  };

  if (!transaction) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md w-full">
          <p className="text-xl text-red-500 mb-2">Error</p>
          <p className="text-gray-500 mb-6">No se encontró información de la transacción</p>
          <button onClick={handleBackToStore} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold cursor-pointer">
            Volver a la tienda
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    APPROVED: { icon: '✅', title: 'Pago Aprobado', color: 'text-green-600', bg: 'bg-green-50' },
    DECLINED: { icon: '❌', title: 'Pago Rechazado', color: 'text-red-600', bg: 'bg-red-50' },
    ERROR: { icon: '⚠️', title: 'Error en el Pago', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    PENDING: { icon: '⏳', title: 'Pago Pendiente', color: 'text-blue-600', bg: 'bg-blue-50' },
  };

  const config = statusConfig[transaction.status] || statusConfig.ERROR;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md w-full">
        <div className={`w-20 h-20 ${config.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <span className="text-4xl">{config.icon}</span>
        </div>

        <h2 className={`text-2xl font-bold ${config.color} mb-2`}>{config.title}</h2>

        <div className="mt-6 space-y-2 text-sm text-left bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Referencia</span>
            <span className="text-gray-800 font-mono text-xs">{transaction.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="text-gray-800 font-semibold">{formatCOP(transaction.totalInCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Estado</span>
            <span className={`font-semibold ${config.color}`}>{transaction.status}</span>
          </div>
          {transaction.externalTransactionId && (
            <div className="flex justify-between">
              <span className="text-gray-500">ID Transacción</span>
              <span className="text-gray-800 font-mono text-xs">{transaction.externalTransactionId}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleBackToStore}
          className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}