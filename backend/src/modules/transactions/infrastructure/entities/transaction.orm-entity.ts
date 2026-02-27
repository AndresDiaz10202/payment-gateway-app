import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../../domain/enums/transaction-status.enum';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  reference: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'amount_in_cents', type: 'int' })
  amountInCents: number;

  @Column({ name: 'base_fee_in_cents', type: 'int' })
  baseFeeInCents: number;

  @Column({ name: 'delivery_fee_in_cents', type: 'int' })
  deliveryFeeInCents: number;

  @Column({ name: 'total_in_cents', type: 'int' })
  totalInCents: number;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ name: 'external_transaction_id', type: 'varchar', length: 100, nullable: true })
  externalTransactionId: string | null;

  @Column({ name: 'payment_method_type', type: 'varchar', length: 20, default: 'CARD' })
  paymentMethodType: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}