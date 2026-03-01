import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import type { IPaymentGateway, CreatePaymentInput, PaymentResult } from '../../domain/ports/payment-gateway.port';

@Injectable()
export class PaymentGatewayAdapter implements IPaymentGateway {
  private readonly sandboxUrl: string;
  private readonly privateKey: string;
  private readonly integritySecret: string;

  constructor(private readonly configService: ConfigService) {
    this.sandboxUrl = this.configService.get<string>('SANDBOX_URL') || '';
    this.privateKey = this.configService.get<string>('PRIVATE_KEY') || '';
    this.integritySecret = this.configService.get<string>('INTEGRITY_SECRET') || '';
  }

  async createTransaction(input: CreatePaymentInput): Promise<PaymentResult> {
    // Generar firma de integridad
    const signatureString = `${input.reference}${input.amountInCents}${input.currency}${this.integritySecret}`;
    const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

    const response = await axios.post(
      `${this.sandboxUrl}/transactions`,
      {
        amount_in_cents: input.amountInCents,
        currency: input.currency,
        customer_email: input.customerEmail,
        payment_method: {
          type: 'CARD',
          installments: input.installments,
          token: input.cardToken,
        },
        reference: input.reference,
        acceptance_token: input.acceptanceToken,
        signature: signature,
      },
      {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return {
      id: response.data.data.id,
      status: response.data.data.status,
      reference: response.data.data.reference,
    };
  }

  async getTransaction(transactionId: string): Promise<PaymentResult> {
    const response = await axios.get(
      `${this.sandboxUrl}/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${this.privateKey}`,
        },
      },
    );

    return {
      id: response.data.data.id,
      status: response.data.data.status,
      reference: response.data.data.reference,
    };
  }
}