import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { GetDeliveryUseCase } from '../../application/use-cases/get-delivery.use-case';

@Controller('api/deliveries')
export class DeliveryController {
  constructor(
    private readonly getDeliveryUseCase: GetDeliveryUseCase,
  ) {}

  @Get(':transactionId')
  async findByTransactionId(@Param('transactionId') transactionId: string) {
    const result = await this.getDeliveryUseCase.execute(transactionId);
    if (result.isFail()) {
      throw new NotFoundException(result.getError().message);
    }
    return result.getValue();
  }
}