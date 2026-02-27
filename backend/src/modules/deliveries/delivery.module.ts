import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrmEntity } from './infrastructure/entities/delivery.orm-entity';
import { DeliveryController } from './infrastructure/controllers/delivery.controller';
import { TypeOrmDeliveryRepository } from './infrastructure/repositories/typeorm-delivery.repository';
import { GetDeliveryUseCase } from './application/use-cases/get-delivery.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrmEntity])],
  controllers: [DeliveryController],
  providers: [
    GetDeliveryUseCase,
    {
      provide: 'IDeliveryRepository',
      useClass: TypeOrmDeliveryRepository,
    },
  ],
  exports: ['IDeliveryRepository'],
})
export class DeliveryModule {}