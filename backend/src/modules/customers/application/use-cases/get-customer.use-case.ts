import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Customer } from '../../domain/entities/customer.entity';
import type { ICustomerRepository } from '../../domain/ports/customer-repository.port';

@Injectable()
export class GetCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(id: string): Promise<Result<Customer, DomainError>> {
    try {
      const customer = await this.customerRepository.findById(id);
      if (!customer) {
        return Result.fail(
          DomainError.create('CUSTOMER_NOT_FOUND', `Cliente con id ${id} no encontrado`),
        );
      }
      return Result.ok(customer);
    } catch (error) {
      return Result.fail(
        DomainError.create('CUSTOMER_FETCH_ERROR', 'Error al obtener el cliente'),
      );
    }
  }
}