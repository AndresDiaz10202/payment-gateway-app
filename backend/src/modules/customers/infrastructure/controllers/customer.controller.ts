import { Controller, Get, Post, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCustomerUseCase } from '../../application/use-cases/create-customer.use-case';
import { GetCustomerUseCase } from '../../application/use-cases/get-customer.use-case';

@Controller('api/customers')
export class CustomerController {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    private readonly getCustomerUseCase: GetCustomerUseCase,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const result = await this.createCustomerUseCase.execute(body);
    if (result.isFail()) {
      throw new BadRequestException(result.getError().message);
    }
    return result.getValue();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.getCustomerUseCase.execute(id);
    if (result.isFail()) {
      throw new NotFoundException(result.getError().message);
    }
    return result.getValue();
  }
}