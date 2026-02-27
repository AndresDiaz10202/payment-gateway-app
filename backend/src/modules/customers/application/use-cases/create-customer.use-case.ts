import { Injectable, Inject } from '@nestjs/common';
import { Result } from '../../../../shared/result';
import { DomainError } from '../../../../shared/errors/domain-error';
import { Customer } from '../../domain/entities/customer.entity';
import type { ICustomerRepository } from '../../domain/ports/customer-repository.port';

@Injectable()
export class CreateCustomerUseCase {
  constructor(
    @Inject('ICustomerRepository')
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(input: Partial<Customer>): Promise<Result<Customer, DomainError>> {
    try {
      // Validar campos requeridos
      if (!input.fullName || !input.email || !input.phone) {
        return Result.fail(
          DomainError.create('INVALID_CUSTOMER_DATA', 'Nombre, email y teléfono son requeridos'),
        );
      }

      // Verificar si ya existe por email
      const existing = await this.customerRepository.findByEmail(input.email);
      if (existing) {
        return Result.ok(existing);
      }

      const customer = await this.customerRepository.create(input);
      return Result.ok(customer);
    } catch (error) {
      return Result.fail(
        DomainError.create('CUSTOMER_CREATE_ERROR', 'Error al crear el cliente'),
      );
    }
  }
}