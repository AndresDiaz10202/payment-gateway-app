import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOrmEntity } from './modules/products/infrastructure/entities/product.orm-entity';
import { CustomerOrmEntity } from './modules/customers/infrastructure/entities/customer.orm-entity';
import { TransactionOrmEntity } from './modules/transactions/infrastructure/entities/transaction.orm-entity';
import { DeliveryOrmEntity } from './modules/deliveries/infrastructure/entities/delivery.orm-entity';
import { ProductModule } from './modules/products/product.module';
import { CustomerModule } from './modules/customers/customer.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { DeliveryModule } from './modules/deliveries/delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          ProductOrmEntity,
          CustomerOrmEntity,
          TransactionOrmEntity,
          DeliveryOrmEntity,
        ],
        synchronize: true,
      }),
    }),
    ProductModule,
    CustomerModule,
    TransactionModule,
    DeliveryModule,
  ],
})
export class AppModule {}