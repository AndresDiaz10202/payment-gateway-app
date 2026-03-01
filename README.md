# Payment Gateway App

Aplicación web FullStack (SPA + API Backend) que simula un e-commerce con pasarela de pagos en Sandbox. Permite a un cliente seleccionar un producto, ingresar datos de tarjeta de crédito y envío, procesar el pago y actualizar el inventario.

## URLs de Deploy

| Recurso       | URL                                                                       |
|---------------|---------------------------------------------------------------------------|
| Frontend (S3) | http://payment-gateway-frontend-245209.s3-website-us-east-1.amazonaws.com |
| Backend API   | http://54.145.48.67:3000/api/products                                    |
| Swagger Docs  | http://54.145.48.67:3000/api/docs                                        |

## Stack Tecnológico

**Frontend:** React 18 + TypeScript, Redux Toolkit, Tailwind CSS, Vite, Axios, Jest + RTL

**Backend:** NestJS + TypeScript, PostgreSQL, TypeORM, Helmet (OWASP), Swagger, Jest

**Infraestructura:** AWS ECS Fargate (backend), AWS S3 (frontend), AWS RDS PostgreSQL, AWS ECR

## Arquitectura

### Arquitectura Hexagonal (Ports & Adapters)
```
backend/src/
├── shared/
│   ├── result.ts                    ← Result<T,E> para Railway Oriented Programming
│   └── errors/domain-error.ts
├── modules/
│   ├── products/
│   │   ├── domain/
│   │   │   ├── entities/product.entity.ts
│   │   │   └── ports/product-repository.port.ts
│   │   ├── application/use-cases/
│   │   │   ├── get-products.use-case.ts
│   │   │   └── get-product-by-id.use-case.ts
│   │   └── infrastructure/
│   │       ├── controllers/product.controller.ts
│   │       ├── repositories/typeorm-product.repository.ts
│   │       └── entities/product.orm-entity.ts
│   ├── transactions/
│   │   ├── domain/
│   │   │   ├── entities/transaction.entity.ts
│   │   │   ├── enums/transaction-status.enum.ts
│   │   │   └── ports/
│   │   │       ├── transaction-repository.port.ts
│   │   │       └── payment-gateway.port.ts
│   │   ├── application/use-cases/
│   │   │   ├── create-transaction.use-case.ts
│   │   │   ├── get-transaction.use-case.ts
│   │   │   └── poll-transaction-status.use-case.ts
│   │   └── infrastructure/
│   │       ├── controllers/transaction.controller.ts
│   │       ├── controllers/config.controller.ts
│   │       ├── repositories/typeorm-transaction.repository.ts
│   │       └── adapters/payment-gateway.adapter.ts
│   ├── customers/
│   │   ├── domain/ │ application/ │ infrastructure/
│   └── deliveries/
│       ├── domain/ │ application/ │ infrastructure/
```

### Railway Oriented Programming (ROP)

Todos los Use Cases retornan `Result<T, DomainError>` con encadenamiento funcional. Si un paso falla, el flujo se detiene sin exceptions.
```
CreateTransaction: validateInput → checkStock → createCustomer → createTransaction → createDelivery → processPayment → updateStatus
```

## Modelo de Datos
```
┌──────────────┐     ┌──────────────┐     ┌────────────────┐     ┌───────────────┐
│   products   │     │  customers   │     │ transactions   │     │  deliveries   │
├──────────────┤     ├──────────────┤     ├────────────────┤     ├───────────────┤
│ id (UUID PK) │     │ id (UUID PK) │     │ id (UUID PK)   │     │ id (UUID PK)  │
│ name         │     │ full_name    │     │ reference      │     │ transaction_id│
│ description  │     │ email        │     │ product_id FK  │     │ recipient_name│
│ price (cents)│     │ phone        │     │ customer_id FK │     │ address       │
│ stock        │     │ legal_id_type│     │ quantity       │     │ city          │
│ image_url    │     │ legal_id     │     │ amount_in_cents│     │ department    │
│ created_at   │     │ created_at   │     │ base_fee       │     │ phone         │
└──────────────┘     └──────────────┘     │ delivery_fee   │     │ status        │
                                          │ total_in_cents │     │ created_at    │
                                          │ status         │     └───────────────┘
                                          │ external_id    │
                                          │ created_at     │
                                          │ updated_at     │
                                          └────────────────┘

products 1:N transactions | customers 1:N transactions | transactions 1:1 deliveries
```

## API Endpoints

| Método | Endpoint                       | Descripción                          |
|--------|--------------------------------|--------------------------------------|
| GET    | /api/products                  | Lista todos los productos con stock  |
| GET    | /api/products/:id              | Detalle de un producto               |
| POST   | /api/customers                 | Crea un cliente                      |
| GET    | /api/customers/:id             | Obtiene datos de un cliente          |
| POST   | /api/transactions              | Crea transacción + procesa pago      |
| GET    | /api/transactions/:id          | Consulta estado de transacción       |
| GET    | /api/transactions/:id/poll     | Polling: consulta estado en pasarela |
| GET    | /api/config/public-key         | Retorna public key y sandbox URL     |
| GET    | /api/deliveries/:transactionId | Info de entrega por transacción      |

## Flujo de Negocio (5 Pantallas)

1. **Product Page** → Grid de productos con imagen, nombre, precio, stock. Botón "Pagar con tarjeta de crédito".
2. **Checkout Modal** → Datos de tarjeta (validación Luhn, detección Visa/Mastercard), datos personales y envío.
3. **Summary Backdrop** → Desglose: subtotal + tarifa base ($5.000) + envío ($10.000). Botón "Pagar".
4. **Transaction Status** → Resultado: APPROVED ✅ / DECLINED ❌ / ERROR ⚠️. Referencia y detalles.
5. **Product Page (actualizado)** → Stock actualizado si el pago fue aprobado.

## Flujo de Pago

1. Frontend obtiene `acceptance_token` de la pasarela (GET /merchants/{publicKey})
2. Frontend tokeniza la tarjeta directamente con la pasarela (POST /tokens/cards) — **los datos de tarjeta NUNCA pasan por el backend**
3. Backend crea la transacción en la pasarela con firma de integridad SHA256
4. Backend hace polling hasta obtener estado final (APPROVED/DECLINED/ERROR)
5. Si APPROVED, se descuenta el stock automáticamente

## Seguridad (OWASP)

- Tokenización directa frontend → pasarela (datos de tarjeta nunca llegan al backend)
- Helmet para security headers (CSP, X-Content-Type-Options, HSTS, X-Frame-Options, X-XSS-Protection)
- Firma de integridad SHA256 para transacciones
- Validación de inputs con class-validator (DTOs)
- CORS configurado
- SSL en conexión a RDS
- Variables sensibles en variables de entorno (nunca en código)

## Cómo Correr Localmente

### Prerrequisitos
- Node.js 22+ | npm 10+ | Docker | Git

### 1. Clonar el repositorio
```bash
git clone <repo-url>
cd payment-gateway-app
```

### 2. Base de datos (Docker)
```bash
docker run --name pg-payment-gateway -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=payment_app -p 5432:5432 -d postgres:15
```

### 3. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run start:dev
```
El backend corre en http://localhost:3000. Swagger en http://localhost:3000/api/docs.

### 4. Frontend
```bash
cd frontend
npm install
npm run dev
```
El frontend corre en http://localhost:5173.

### Variables de entorno (.env del backend)
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=payment_app
SANDBOX_URL=https://api-sandbox.co.uat.wompi.dev/v1
PUBLIC_KEY=pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7
PRIVATE_KEY=prv_stagtest_5i0ZGIGiFcDQifYsXxvsny7Y37tKqFWg
EVENTS_SECRET=stagtest_events_2PDUmhMywUkvb1LvxYnayFbmofT7w39N
INTEGRITY_SECRET=stagtest_integrity_nAIBuqayW70XpUqJS4qf4STYiISd89Fp
```

## Tarjetas de Prueba

| Número              | Resultado |
|---------------------|-----------|
| 4242 4242 4242 4242 | APPROVED  |
| 4111 1111 1111 1111 | DECLINED  |
| Cualquier otra      | ERROR     |

CVC: cualquier 3 dígitos. Expiración: cualquier fecha futura.

## Cobertura de Tests

### Backend: 96% Statements | 86% Branch | 96% Functions | 95% Lines
**41 tests, 11 suites — todos pasan ✅**

| Archivo                             | Stmts  | Branch | Funcs  | Lines  |
|-------------------------------------|--------|--------|--------|--------|
| create-transaction.use-case.ts      | 97.87% | 95%    | 100%   | 97.72% |
| get-transaction.use-case.ts         | 100%   | 100%   | 100%   | 100%   |
| poll-transaction-status.use-case.ts | 91.42% | 70.58% | 100%   | 90.9%  |
| get-products.use-case.ts            | 100%   | 100%   | 100%   | 100%   |
| get-product-by-id.use-case.ts       | 100%   | 100%   | 100%   | 100%   |
| create-customer.use-case.ts         | 100%   | 100%   | 100%   | 100%   |
| get-customer.use-case.ts            | 100%   | 100%   | 100%   | 100%   |
| get-delivery.use-case.ts            | 100%   | 100%   | 100%   | 100%   |
| result.ts                           | 85%    | 75%    | 88.88% | 85%    |
| domain-error.ts                     | 100%   | 100%   | 100%   | 100%   |

### Frontend: 85% Statements | 82% Branch | 83% Functions | 84% Lines
**49 tests, 6 suites — todos pasan ✅**

| Archivo             | Stmts  | Branch | Funcs  | Lines  |
|---------------------|--------|--------|--------|--------|
| cardValidation.ts   | 100%   | 100%   | 100%   | 100%   |
| formatCurrency.ts   | 100%   | 100%   | 100%   | 100%   |
| checkoutSlice.ts    | 100%   | 100%   | 100%   | 100%   |
| productsSlice.ts    | 77.27% | 50%    | 62.5%  | 77.27% |
| transactionSlice.ts | 83.33% | 83.33% | 75%    | 83.33% |
| App.tsx             | 61.53% | 60%    | 66.66% | 60%    |

### Ejecutar tests
```bash
# Backend
cd backend
npm test -- --coverage

# Frontend
cd frontend
npm test -- --coverage
```

## Deploy en AWS

| Componente      | Servicio AWS      | Detalle                            |
|-----------------|-------------------|------------------------------------|
| Frontend        | S3 Static Hosting | Bucket público con website hosting |
| Backend         | ECS Fargate       | Container Docker, 0.25 vCPU, 512MB |
| Base de datos   | RDS PostgreSQL 15 | db.t3.micro (Free tier), SSL       |
| Imágenes Docker | ECR               | Multi-stage build, node:22-alpine  |
| Logs            | CloudWatch        | /ecs/payment-gateway-backend       |