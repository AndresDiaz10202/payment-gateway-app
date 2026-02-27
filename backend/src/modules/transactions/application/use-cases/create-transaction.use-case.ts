import { Injectable, Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Transaction } from '../../domain/entities/transaction.entity';
import type { ITransactionRepository } from '../../domain/ports/transaction-repository.port';
import type { IProductRepository } from '../../../products/domain/ports/product-repository.port';
import type { ICustomerRepository } from '../../../customers/domain/ports/customer-repository.port';
import type { IDeliveryRepository } from '../../../deliveries/domain/ports/delivery-repository.port';
import type { IPaymentGateway } from '../../domain/ports/payment-gateway.port';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

export interface CreateTransactionInput {
  productId: string;
  quantity: number;
  customerData: {
    fullName: string;
    email: string;
    phone: string;
    legalIdType: string;
    legalId: string;
  };
  deliveryData: {
    recipientName: string;
    address: string;
    city: string;
    department: string;
    phone: string;
  };
  cardToken: string;
  acceptanceToken: string;
  installments?: number;
}

const BASE_FEE_IN_CENTS = 500000; // $5,000 COP
const DELIVERY_FEE_IN_CENTS = 1000000; // $10,000 COP

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
    @Inject('IPaymentGateway')
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(input: CreateTransactionInput): Promise<Result<Transaction, DomainError>> {
    // 1. Validar input
    const validation = this.validateInput(input);
    if (validation.isFail()) return validation as unknown as Result<Transaction, DomainError>;

    // 2. Verificar stock
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      return Result.fail(DomainError.create('PRODUCT_NOT_FOUND', 'Producto no encontrado'));
    }
    if (product.stock < input.quantity) {
      return Result.fail(DomainError.create('INSUFFICIENT_STOCK', 'Stock insuficiente'));
    }

    // 3. Crear o encontrar cliente
    let customer = await this.customerRepository.findByEmail(input.customerData.email);
    if (!customer) {
      customer = await this.customerRepository.create(input.customerData);
    }

    // 4. Calcular montos
    const amountInCents = product.price * input.quantity;
    const totalInCents = amountInCents + BASE_FEE_IN_CENTS + DELIVERY_FEE_IN_CENTS;
    const reference = `order_${uuidv4()}`;

    // 5. Crear transacción en PENDING
    const transaction = await this.transactionRepository.create({
      reference,
      productId: product.id,
      customerId: customer.id,
      quantity: input.quantity,
      amountInCents,
      baseFeeInCents: BASE_FEE_IN_CENTS,
      deliveryFeeInCents: DELIVERY_FEE_IN_CENTS,
      totalInCents,
      status: TransactionStatus.PENDING,
      paymentMethodType: 'CARD',
    });

    // 6. Crear delivery
    await this.deliveryRepository.create({
      transactionId: transaction.id,
      ...input.deliveryData,
    });

    // 7. Procesar pago con gateway
    try {
      const paymentResult = await this.paymentGateway.createTransaction({
        amountInCents: totalInCents,
        currency: 'COP',
        customerEmail: customer.email,
        cardToken: input.cardToken,
        reference,
        acceptanceToken: input.acceptanceToken,
        installments: input.installments || 1,
      });

      // 8. Actualizar transacción con ID externo
      await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.PENDING,
        paymentResult.id,
      );

      transaction.externalTransactionId = paymentResult.id;
      return Result.ok(transaction);
    } catch (error) {
      await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.ERROR,
      );
      return Result.fail(
        DomainError.create('PAYMENT_ERROR', 'Error al procesar el pago'),
      );
    }
  }

  private validateInput(input: CreateTransactionInput): Result<void, DomainError> {
    if (!input.productId) {
      return Result.fail(DomainError.create('INVALID_INPUT', 'productId es requerido'));
    }
    if (!input.quantity || input.quantity < 1) {
      return Result.fail(DomainError.create('INVALID_INPUT', 'quantity debe ser mayor a 0'));
    }
    if (!input.cardToken) {
      return Result.fail(DomainError.create('INVALID_INPUT', 'cardToken es requerido'));
    }
    if (!input.acceptanceToken) {
      return Result.fail(DomainError.create('INVALID_INPUT', 'acceptanceToken es requerido'));
    }
    return Result.ok(undefined);
  }
}