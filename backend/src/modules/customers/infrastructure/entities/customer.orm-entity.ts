import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ name: 'legal_id_type', type: 'varchar', length: 5 })
  legalIdType: string;

  @Column({ name: 'legal_id', type: 'varchar', length: 20 })
  legalId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}