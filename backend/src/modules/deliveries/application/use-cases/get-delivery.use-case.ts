import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Delivery } from '../../domain/entities/delivery.entity';
import type { IDeliveryRepository } from '../../domain/ports/delivery-repository.port';

@Injectable()
export class GetDeliveryUseCase {
  constructor(
    @Inject('IDeliveryRepository')
    private readonly deliveryRepository: IDeliveryRepository,
  ) {}

  async execute(transactionId: string): Promise<Result<Delivery, DomainError>> {
    try {
      const delivery = await this.deliveryRepository.findByTransactionId(transactionId);
      if (!delivery) {
        return Result.fail(
          DomainError.create('DELIVERY_NOT_FOUND', `Entrega para transacción ${transactionId} no encontrada`),
        );
      }
      return Result.ok(delivery);
    } catch (error) {
      return Result.fail(
        DomainError.create('DELIVERY_FETCH_ERROR', 'Error al obtener la entrega'),
      );
    }
  }
}