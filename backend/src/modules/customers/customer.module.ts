import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerOrmEntity } from './infrastructure/entities/customer.orm-entity';
import { CustomerController } from './infrastructure/controllers/customer.controller';
import { TypeOrmCustomerRepository } from './infrastructure/repositories/typeorm-customer.repository';
import { CreateCustomerUseCase } from './application/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from './application/use-cases/get-customer.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomerController],
  providers: [
    CreateCustomerUseCase,
    GetCustomerUseCase,
    {
      provide: 'ICustomerRepository',
      useClass: TypeOrmCustomerRepository,
    },
  ],
  exports: ['ICustomerRepository'],
})
export class CustomerModule {}