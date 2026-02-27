import { DeliveryStatus } from '../enums/delivery-status.enum';

export class Delivery {
  id: string;
  transactionId: string;
  recipientName: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  status: DeliveryStatus;
  createdAt: Date;
}