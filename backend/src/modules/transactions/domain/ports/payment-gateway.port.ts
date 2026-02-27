export interface CreatePaymentInput {
  amountInCents: number;
  currency: string;
  customerEmail: string;
  cardToken: string;
  reference: string;
  acceptanceToken: string;
  installments: number;
}

export interface PaymentResult {
  id: string;
  status: string;
  reference: string;
}

export interface IPaymentGateway {
  createTransaction(input: CreatePaymentInput): Promise<PaymentResult>;
  getTransaction(transactionId: string): Promise<PaymentResult>;
}