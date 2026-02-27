import { Delivery } from '../entities/delivery.entity';

export interface IDeliveryRepository {
  create(delivery: Partial<Delivery>): Promise<Delivery>;
  findByTransactionId(transactionId: string): Promise<Delivery | null>;
}