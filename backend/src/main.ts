import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { seedProducts } from './database/seeds/product.seed';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers (OWASP) - configurado para HTTP
  app.use(helmet({
    contentSecurityPolicy: false,
    strictTransportSecurity: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
    originAgentCluster: false,
  }));

  // Validación global de DTOs
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS
  app.enableCors();

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Payment Gateway API')
    .setDescription('API para e-commerce con pasarela de pagos')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Seed
  const dataSource = app.get(DataSource);
  await seedProducts(dataSource);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();