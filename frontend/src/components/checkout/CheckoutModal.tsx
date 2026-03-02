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
  const product = useAppSelector((state: RootState) => {
    const productId = state.checkout.productId;
    return state.products.items.find((p) => p.id === productId);
  });

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
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  const brand = detectCardBrand(card.number);
  const cleanNumber = card.number.replace(/\s/g, '');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!cleanNumber || cleanNumber.length < 13 || cleanNumber.length > 19) {
      newErrors.cardNumber = 'Número de tarjeta inválido';
    } else if (!isValidLuhn(cleanNumber)) {
      newErrors.cardNumber = 'Número de tarjeta no pasa validación';
    }
    if (!isValidCardHolder(card.cardHolder)) newErrors.cardHolder = 'Nombre debe tener al menos 3 letras';
    if (!isValidExpiry(card.expMonth, card.expYear)) newErrors.expiry = 'Fecha inválida o vencida';
    if (!isValidCvc(card.cvc)) newErrors.cvc = 'CVC debe ser 3 dígitos';
    if (!customer.fullName.trim()) newErrors.fullName = 'Nombre requerido';
    if (!customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email)) newErrors.email = 'Email inválido';
    if (!customer.phone.trim()) newErrors.phone = 'Teléfono requerido';
    if (!delivery.address.trim()) newErrors.address = 'Dirección requerida';
    if (!delivery.city.trim()) newErrors.city = 'Ciudad requerida';
    if (!delivery.department.trim()) newErrors.department = 'Departamento requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      // Llevar al usuario a la sección con errores
      const newErrors = {} as Record<string, string>;
      const cleanNum = card.number.replace(/\s/g, '');
      if (!cleanNum || cleanNum.length < 13 || cleanNum.length > 19) newErrors.cardNumber = 'x';
      else if (!isValidLuhn(cleanNum)) newErrors.cardNumber = 'x';
      if (!isValidCardHolder(card.cardHolder)) newErrors.cardHolder = 'x';
      if (!isValidExpiry(card.expMonth, card.expYear)) newErrors.expiry = 'x';
      if (!isValidCvc(card.cvc)) newErrors.cvc = 'x';

      const hasCardErrors = newErrors.cardNumber || newErrors.cardHolder || newErrors.expiry || newErrors.cvc;
      if (hasCardErrors) { setActiveSection(0); return; }

      if (!customer.fullName.trim() || !customer.email.trim() || !/\S+@\S+\.\S+/.test(customer.email) || !customer.phone.trim()) {
        setActiveSection(1); return;
      }

      if (!delivery.address.trim() || !delivery.city.trim() || !delivery.department.trim()) {
        setActiveSection(2); return;
      }
      return;
    }
    dispatch(setCustomerData({ ...customer, legalIdType: customer.legalIdType || 'CC', legalId: customer.legalId || '0000000000' }));
    dispatch(setDeliveryData({ ...delivery, recipientName: customer.fullName, phone: delivery.phone || customer.phone }));
    onCardDataReady(card);
    dispatch(setStep(3));
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => dispatch(setStep(1)), 300);
  };

  const inputStyle = (field: string) => ({
    background: 'rgba(255,255,255,0.05)',
    border: errors[field] ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)',
    color: '#fff',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.3s ease',
  });

  const sectionBtn = (idx: number) => ({
    flex: 1,
    padding: '10px',
    fontSize: '13px',
    fontWeight: 600,
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    background: activeSection === idx ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
    color: activeSection === idx ? '#fff' : 'rgba(255,255,255,0.4)',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(20px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(30,30,50,0.95) 0%, rgba(15,15,25,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 100px rgba(0,0,0,0.5), 0 0 40px rgba(99, 102, 241, 0.1)',
          maxHeight: '90vh',
          overflowY: 'auto',
          transform: visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h2 className="text-xl font-bold" style={{ color: '#fff' }}>Checkout</h2>
              {product && (
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {product.name}
                </p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.color = '#fca5a5'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
            >
              ✕
            </button>
          </div>

          {/* Credit card preview */}
          <div
            className="relative rounded-2xl p-5 mt-4 overflow-hidden"
            style={{
              background: brand === 'visa'
                ? 'linear-gradient(135deg, #1e3a5f, #2d5a8e)'
                : brand === 'mastercard'
                  ? 'linear-gradient(135deg, #4a1942, #7b2d6e)'
                  : 'linear-gradient(135deg, #1a1a2e, #2d2d44)',
              height: '180px',
              transition: 'background 0.5s ease',
            }}
          >
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2), transparent 50%)',
            }} />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="w-10 h-7 rounded" style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)' }} />
                <span className="text-sm font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {brand === 'visa' ? 'VISA' : brand === 'mastercard' ? 'MASTERCARD' : 'CARD'}
                </span>
              </div>
              <div>
                <p className="text-lg font-mono tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
                  {card.number || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between">
                  <p className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {card.cardHolder || 'NOMBRE DEL TITULAR'}
                  </p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {card.expMonth || 'MM'}/{card.expYear || 'YY'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section tabs */}
        <div className="px-6 pt-5">
          <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <button style={sectionBtn(0)} onClick={() => setActiveSection(0)}>💳 Tarjeta</button>
            <button style={sectionBtn(1)} onClick={() => setActiveSection(1)}>👤 Personal</button>
            <button style={sectionBtn(2)} onClick={() => setActiveSection(2)}>📦 Envío</button>
          </div>
        </div>

        {/* Form content */}
        <div className="p-6">
          {/* Card section */}
          {activeSection === 0 && (
            <div className="space-y-4" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Número de tarjeta {brand !== 'unknown' && <span className="ml-1" style={{ color: brand === 'visa' ? '#60a5fa' : '#c084fc' }}>({brand.toUpperCase()})</span>}
                </label>
                <input type="text" placeholder="4242 4242 4242 4242" value={card.number}
                  onChange={(e) => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                  style={inputStyle('cardNumber')} maxLength={19}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = errors.cardNumber ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
                {errors.cardNumber && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.cardNumber}</p>}
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Nombre del titular</label>
                <input type="text" placeholder="PEDRO PÉREZ" value={card.cardHolder}
                  onChange={(e) => setCard({ ...card, cardHolder: e.target.value.toUpperCase() })}
                  style={inputStyle('cardHolder')}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = errors.cardHolder ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                />
                {errors.cardHolder && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.cardHolder}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Mes</label>
                  <input type="text" placeholder="MM" value={card.expMonth}
                    onChange={(e) => setCard({ ...card, expMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    style={inputStyle('expiry')} maxLength={2}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = errors.expiry ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Año</label>
                  <input type="text" placeholder="YY" value={card.expYear}
                    onChange={(e) => setCard({ ...card, expYear: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                    style={inputStyle('expiry')} maxLength={2}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = errors.expiry ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                  />
                  {errors.expiry && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.expiry}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>CVC</label>
                  <input type="text" placeholder="123" value={card.cvc}
                    onChange={(e) => setCard({ ...card, cvc: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                    style={inputStyle('cvc')} maxLength={3}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = errors.cvc ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                  />
                  {errors.cvc && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.cvc}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Personal section */}
          {activeSection === 1 && (
            <div className="space-y-4" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Nombre completo</label>
                <input type="text" placeholder="Juan Pérez" value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })} style={inputStyle('fullName')}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = errors.fullName ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                />
                {errors.fullName && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
                <input type="email" placeholder="juan@email.com" value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })} style={inputStyle('email')}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = errors.email ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                />
                {errors.email && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.email}</p>}
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Teléfono</label>
                <input type="text" placeholder="3001234567" value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })} style={inputStyle('phone')}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = errors.phone ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                />
                {errors.phone && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.phone}</p>}
              </div>
            </div>
          )}

          {/* Shipping section */}
          {activeSection === 2 && (
            <div className="space-y-4" style={{ animation: 'fadeIn 0.3s ease' }}>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Dirección</label>
                <input type="text" placeholder="Cra 10 #20-30" value={delivery.address}
                  onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} style={inputStyle('address')}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = errors.address ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                />
                {errors.address && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.address}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Ciudad</label>
                  <input type="text" placeholder="Bogotá" value={delivery.city}
                    onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} style={inputStyle('city')}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = errors.city ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                  />
                  {errors.city && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.city}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Departamento</label>
                  <input type="text" placeholder="Cundinamarca" value={delivery.department}
                    onChange={(e) => setDelivery({ ...delivery, department: e.target.value })} style={inputStyle('department')}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(99, 102, 241, 0.5)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = errors.department ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255,255,255,0.1)'; }}
                  />
                  {errors.department && <p className="text-xs mt-1" style={{ color: '#f87171' }}>{errors.department}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Continuar al resumen →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}