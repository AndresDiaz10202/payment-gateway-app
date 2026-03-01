export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // en centavos
  stock: number;
  imageUrl: string;
  createdAt: string;
}

export interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  legalIdType: string;
  legalId: string;
}

export interface DeliveryData {
  recipientName: string;
  address: string;
  city: string;
  department: string;
  phone: string;
}

export interface Transaction {
  id: string;
  reference: string;
  productId: string;
  customerId: string;
  quantity: number;
  amountInCents: number;
  baseFeeInCents: number;
  deliveryFeeInCents: number;
  totalInCents: number;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  externalTransactionId: string | null;
  paymentMethodType: string;
  createdAt: string;
  updatedAt: string;
}

export interface CardData {
  number: string;
  cardHolder: string;
  expMonth: string;
  expYear: string;
  cvc: string;
}