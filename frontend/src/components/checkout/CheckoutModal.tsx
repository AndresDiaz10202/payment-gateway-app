import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { setCustomerData, setDeliveryData, setStep } from '../../store/slices/checkoutSlice';
import { isValidLuhn, detectCardBrand, isValidExpiry, isValidCvc, isValidCardHolder, formatCardNumber } from '../../utils/cardValidation';
import type { RootState } from '../../store';
import type { CardData } from '../../types';

interface Props {
  onCardDataReady: (cardData: CardData) => void;
}

export default function CheckoutModal({ onCardDataReady }: Props) {
  const dispatch = useAppDispatch();
  const { customerData, deliveryData } = useAppSelector((state: RootState) => state.checkout);

  const [card, setCard] = useState<CardData>({
    number: '',
    cardHolder: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });

  const [customer, setCustomer] = useState(customerData);
  const [delivery, setDelivery] = useState(deliveryData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brand = detectCardBrand(card.number);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const cleanNumber = card.number.replace(/\s/g, '');

    if (!cleanNumber || cleanNumber.length < 13 || cleanNumber.length > 19) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    } else if (!isValidLuhn(cleanNumber)) {
      newErrors.cardNumber = 'Número de tarjeta no pasa validación';
    }

    if (!isValidCardHolder(card.cardHolder)) {
      newErrors.cardHolder = 'Nombre debe tener al menos 3 letras';
    }
    if (!isValidExpiry(card.expMonth, card.expYear)) {
      newErrors.expiry = 'Fecha de expiración inválida o vencida';
    }
    if (!isValidCvc(card.cvc)) {
      newErrors.cvc = 'CVC debe ser 3 dígitos';
    }
    if (!customer.fullName.trim()) newErrors.fullName = 'Nombre requerido';
    if (!customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!customer.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!delivery.address.trim()) newErrors.address = 'Dirección requerida';
    if (!delivery.city.trim()) newErrors.city = 'Ciudad requerida';
    if (!delivery.department.trim()) newErrors.department = 'Departamento requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    dispatch(setCustomerData({ ...customer, legalIdType: customer.legalIdType || 'CC', legalId: customer.legalId || '0000000000' }));
    dispatch(setDeliveryData({ ...delivery, recipientName: customer.fullName, phone: delivery.phone || customer.phone }));
    onCardDataReady(card);
    dispatch(setStep(3));
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
      errors[field] ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-blue-300'
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Datos de pago</h2>
          <button onClick={() => dispatch(setStep(1))} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>

        {/* Tarjeta de crédito */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Tarjeta de Crédito</h3>

          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <label className="text-sm text-gray-600">Número de tarjeta</label>
              {brand !== 'unknown' && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${brand === 'visa' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                  {brand.toUpperCase()}
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              value={card.number}
              onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
              className={inputClass('cardNumber')}
              maxLength={19}
            />
            {errors.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="mb-3">
            <label className="text-sm text-gray-600">Nombre del titular</label>
            <input
              type="text"
              placeholder="PEDRO PÉREZ"
              value={card.cardHolder}
              onChange={(e) => setCard({ ...card, cardHolder: e.target.value.toUpperCase() })}
              className={inputClass('cardHolder')}
            />
            {errors.cardHolder && <p className="text-xs text-red-500 mt-1">{errors.cardHolder}</p>}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">Mes</label>
              <input
                type="text"
                placeholder="MM"
                value={card.expMonth}
                onChange={(e) => setCard({ ...card, expMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                className={inputClass('expiry')}
                maxLength={2}
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Año</label>
              <input
                type="text"
                placeholder="YY"
                value={card.expYear}
                onChange={(e) => setCard({ ...card, expYear: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                className={inputClass('expiry')}
                maxLength={2}
              />
              {errors.expiry && <p className="text-xs text-red-500 mt-1 col-span-2">{errors.expiry}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-600">CVC</label>
              <input
                type="text"
                placeholder="123"
                value={card.cvc}
                onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                className={inputClass('cvc')}
                maxLength={3}
              />
              {errors.cvc && <p className="text-xs text-red-500 mt-1">{errors.cvc}</p>}
            </div>
          </div>
        </div>

        {/* Datos personales */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Datos personales</h3>
          <div className="space-y-3">
            <div>
              <input type="text" placeholder="Nombre completo" value={customer.fullName}
                onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                className={inputClass('fullName')} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <input type="email" placeholder="Email" value={customer.email}
                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                className={inputClass('email')} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <input type="text" placeholder="Teléfono" value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                className={inputClass('phone')} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Datos de envío */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Datos de envío</h3>
          <div className="space-y-3">
            <div>
              <input type="text" placeholder="Dirección" value={delivery.address}
                onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                className={inputClass('address')} />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input type="text" placeholder="Ciudad" value={delivery.city}
                  onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                  className={inputClass('city')} />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <input type="text" placeholder="Departamento" value={delivery.department}
                  onChange={(e) => setDelivery({ ...delivery, department: e.target.value })}
                  className={inputClass('department')} />
                {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department}</p>}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}