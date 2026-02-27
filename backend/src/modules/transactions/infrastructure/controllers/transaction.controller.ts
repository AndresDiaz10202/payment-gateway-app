import { Controller, Get, Post, Param, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/use-cases/create-transaction.use-case';
import { GetTransactionUseCase } from '../../application/use-cases/get-transaction.use-case';

@Controller('api/transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionUseCase: GetTransactionUseCase,
  ) {}

  @Post()
  async create(@Body() body: any) {
    const result = await this.createTransactionUseCase.execute(body);
    if (result.isFail()) {
      throw new BadRequestException(result.getError().message);
    }
    return result.getValue();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const result = await this.getTransactionUseCase.execute(id);
    if (result.isFail()) {
      throw new NotFoundException(result.getError().message);
    }
    return result.getValue();
  }
}