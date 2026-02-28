import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionOrmEntity } from './infrastructure/entities/transaction.orm-entity';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { ConfigController } from './infrastructure/controllers/config.controller';
import { TypeOrmTransactionRepository } from './infrastructure/repositories/typeorm-transaction.repository';
import { PaymentGatewayAdapter } from './infrastructure/adapters/payment-gateway.adapter';
import { CreateTransactionUseCase } from './application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from './application/use-cases/get-transaction.use-case';
import { PollTransactionStatusUseCase } from './application/use-cases/poll-transaction-status.use-case';
import { ProductModule } from '../products/product.module';
import { CustomerModule } from '../customers/customer.module';
import { DeliveryModule } from '../deliveries/delivery.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionOrmEntity]),
    ProductModule,
    CustomerModule,
    DeliveryModule,
  ],
  controllers: [TransactionController, ConfigController],
  providers: [
    CreateTransactionUseCase,
    GetTransactionUseCase,
    PollTransactionStatusUseCase,
    {
      provide: 'ITransactionRepository',
      useClass: TypeOrmTransactionRepository,
    },
    {
      provide: 'IPaymentGateway',
      useClass: PaymentGatewayAdapter,
    },
  ],
})
export class TransactionModule {}