import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchProducts } from '../../store/slices/productsSlice';
import { setProductId, setStep } from '../../store/slices/checkoutSlice';
import { formatCOP } from '../../utils/formatCurrency';
import Spinner from '../common/Spinner';
import type { RootState } from '../../store';

export default function ProductPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state: RootState) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleBuy = (productId: string) => {
    dispatch(setProductId(productId));
    dispatch(setStep(2));
  };

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 p-8">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Nuestra Tienda</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {items.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            <div className="h-48 bg-gray-100 flex items-center justify-center p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/300x200?text=Producto';
                }}
              />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1 flex-1">{product.description}</p>
              <div className="mt-4">
                <p className="text-xl font-bold text-blue-600">{formatCOP(product.price)}</p>
                <p className="text-sm text-gray-500">
                  Stock: <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>{product.stock} unidades</span>
                </p>
              </div>
              <button
                onClick={() => handleBuy(product.id)}
                disabled={product.stock === 0}
                className={`mt-4 w-full py-3 rounded-lg font-semibold text-white transition-colors ${
                  product.stock > 0
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Pagar con tarjeta de crédito' : 'Sin stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}