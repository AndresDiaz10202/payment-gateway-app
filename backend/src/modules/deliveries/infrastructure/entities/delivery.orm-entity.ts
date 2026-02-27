import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { DeliveryStatus } from '../../domain/enums/delivery-status.enum';

@Entity('deliveries')
export class DeliveryOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id', type: 'uuid', unique: true })
  transactionId: string;

  @Column({ name: 'recipient_name', type: 'varchar', length: 255 })
  recipientName: string;

  @Column({ type: 'varchar', length: 500 })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}