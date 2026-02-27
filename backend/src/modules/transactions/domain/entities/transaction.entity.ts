import { TransactionStatus } from '../enums/transaction-status.enum';

export class Transaction {
  id: string;
  reference: string;
  productId: string;
  customerId: string;
  quantity: number;
  amountInCents: number;
  baseFeeInCents: number;
  deliveryFeeInCents: number;
  totalInCents: number;
  status: TransactionStatus;
  externalTransactionId: string | null;
  paymentMethodType: string;
  createdAt: Date;
  updatedAt: Date;
}