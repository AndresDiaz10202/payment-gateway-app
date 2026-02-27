import { Customer } from '../entities/customer.entity';

export interface ICustomerRepository {
  create(customer: Partial<Customer>): Promise<Customer>;
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
}