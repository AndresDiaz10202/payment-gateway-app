import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Transaction } from '../../domain/entities/transaction.entity';
import type { ITransactionRepository } from '../../domain/ports/transaction-repository.port';

@Injectable()
export class GetTransactionUseCase {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async execute(id: string): Promise<Result<Transaction, DomainError>> {
    try {
      const transaction = await this.transactionRepository.findById(id);
      if (!transaction) {
        return Result.fail(
          DomainError.create('TRANSACTION_NOT_FOUND', `Transacción con id ${id} no encontrada`),
        );
      }
      return Result.ok(transaction);
    } catch (error) {
      return Result.fail(
        DomainError.create('TRANSACTION_FETCH_ERROR', 'Error al obtener la transacción'),
      );
    }
  }
}