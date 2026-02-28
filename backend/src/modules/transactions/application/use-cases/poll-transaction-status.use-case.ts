import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Transaction } from '../../domain/entities/transaction.entity';
import type { ITransactionRepository } from '../../domain/ports/transaction-repository.port';
import type { IPaymentGateway } from '../../domain/ports/payment-gateway.port';
import type { IProductRepository } from '../../../products/domain/ports/product-repository.port';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Injectable()
export class PollTransactionStatusUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    @Inject('IPaymentGateway')
    private readonly paymentGateway: IPaymentGateway,
    @Inject('IProductRepository')
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(transactionId: string): Promise<Result<Transaction, DomainError>> {
    try {
      // 1. Buscar transacción interna
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) {
        return Result.fail(
          DomainError.create('TRANSACTION_NOT_FOUND', 'Transacción no encontrada'),
        );
      }

      // 2. Si ya tiene estado final, retornar
      if (transaction.status !== TransactionStatus.PENDING) {
        return Result.ok(transaction);
      }

      // 3. Si no tiene ID externo, no se puede consultar
      if (!transaction.externalTransactionId) {
        return Result.ok(transaction);
      }

      // 4. Consultar estado en la pasarela de pagos
      const paymentResult = await this.paymentGateway.getTransaction(
        transaction.externalTransactionId,
      );

      // 5. Mapear estado externo a interno
      const newStatus = this.mapStatus(paymentResult.status);

      // 6. Si cambió el estado, actualizar
      if (newStatus !== transaction.status) {
        await this.transactionRepository.updateStatus(transaction.id, newStatus);
        transaction.status = newStatus;

        // 7. Si fue aprobado, descontar stock
        if (newStatus === TransactionStatus.APPROVED) {
          const product = await this.productRepository.findById(transaction.productId);
          if (product) {
            await this.productRepository.updateStock(
              product.id,
              product.stock - transaction.quantity,
            );
          }
        }
      }

      return Result.ok(transaction);
    } catch (error) {
      return Result.fail(
        DomainError.create('POLL_ERROR', 'Error al consultar estado de la transacción'),
      );
    }
  }

  private mapStatus(externalStatus: string): TransactionStatus {
    switch (externalStatus) {
      case 'APPROVED':
        return TransactionStatus.APPROVED;
      case 'DECLINED':
        return TransactionStatus.DECLINED;
      case 'VOIDED':
        return TransactionStatus.DECLINED;
      case 'ERROR':
        return TransactionStatus.ERROR;
      default:
        return TransactionStatus.PENDING;
    }
  }
}