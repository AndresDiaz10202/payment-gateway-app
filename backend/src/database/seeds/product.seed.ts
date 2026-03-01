import { DataSource } from 'typeorm';
import { ProductOrmEntity } from '../../modules/products/infrastructure/entities/product.orm-entity';

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const productRepository = dataSource.getRepository(ProductOrmEntity);

  const count = await productRepository.count();
  if (count > 0) {
    console.log('Products already seeded, skipping...');
    return;
  }

  const products = [
    {
      name: 'iPhone 15 Pro',
      description: 'Apple iPhone 15 Pro 256GB, chip A17 Pro, cámara de 48MP, pantalla Super Retina XDR de 6.1 pulgadas.',
      price: 499900000, // $4,999,000 COP en centavos
      stock: 10,
      imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch_GEO_US?wid=940&hei=1112&fmt=p-jpg',
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Samsung Galaxy S24 Ultra 512GB, procesador Snapdragon 8 Gen 3, cámara de 200MP, pantalla Dynamic AMOLED 6.8 pulgadas.',
      price: 459900000, // $4,599,000 COP en centavos
      stock: 15,
      imageUrl: 'https://images.samsung.com/co/smartphones/galaxy-s24-ultra/images/galaxy-s24-ultra-highlights-color-titanium-gray-back-mo.jpg',
    },
    {
      name: 'MacBook Air M3',
      description: 'Apple MacBook Air 15 pulgadas con chip M3, 16GB RAM, 512GB SSD, pantalla Liquid Retina.',
      price: 649900000, // $6,499,000 COP en centavos
      stock: 8,
      imageUrl: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba15-midnight-select-202306?wid=904&hei=840&fmt=jpeg',
    },
    {
      name: 'AirPods Max',
      description: 'Audífonos inalámbricos con cancelación de ruido líder en la industria, 30 horas de batería, audio Hi-Res.',
      price: 189900000, // $1,899,000 COP en centavos
      stock: 25,
      imageUrl: 'https://www.apple.com/v/airpods-max/j/images/overview/bento/midnight/bento_1_airpod_max_midnight__4jy1tkqh9qay_xlarge_2x.jpg',
    },
    {
      name: 'iPad Pro M5',
      description: 'Apple iPad Pro 11 pulgadas con chip M5, pantalla Ultra Retina XDR, 256GB, compatible con Apple Pencil Pro.',
      price: 549900000, // $5,499,000 COP en centavos
      stock: 12,
      imageUrl: 'https://www.apple.com/v/ipad-pro/av/images/overview/closer-look/silver/slide_1A__cxvssgdj2v6u_large_2x.jpg',
    },
  ];

  await productRepository.save(products);
  console.log(`Seeded ${products.length} products successfully`);
}