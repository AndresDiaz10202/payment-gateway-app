import { DataSource } from 'typeorm';
import { ProductOrmEntity } from '../../modules/products/infrastructure/entities/product.orm-entity';

export async function seedProducts(dataSource: DataSource): Promise<void> {
  const productRepository = dataSource.getRepository(ProductOrmEntity);

  // Borrar productos existentes para re-seedear
  await productRepository.clear();

  const products = [
    // ─── APPLE ───
    {
      name: 'iPhone 16 Pro Max',
      description: 'El iPhone más avanzado. Chip A18 Pro, cámara de 48MP con zoom óptico 5x, pantalla Super Retina XDR de 6.9", titanio natural. Control de cámara táctil.',
      price: 599900000,
      stock: 8,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch-naturaltitanium?wid=940&hei=1112&fmt=p-jpg&qlt=80',
    },
    {
      name: 'iPhone 16 Pro',
      description: 'Chip A18 Pro, cámara de 48MP, pantalla Super Retina XDR de 6.3", diseño en titanio. Botón de acción y control de cámara.',
      price: 529900000,
      stock: 12,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-deserttitanium?wid=940&hei=1112&fmt=p-jpg&qlt=80',
    },
    {
      name: 'iPhone 16',
      description: 'Chip A18, cámara dual de 48MP, pantalla Super Retina XDR de 6.1", Dynamic Island. Disponible en 5 colores vibrantes.',
      price: 429900000,
      stock: 20,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch-ultramarine?wid=940&hei=1112&fmt=p-jpg&qlt=80',
    },
    {
      name: 'iPhone 15',
      description: 'Chip A16 Bionic, cámara de 48MP, pantalla Super Retina XDR de 6.1", Dynamic Island. USB-C por primera vez.',
      price: 379900000,
      stock: 15,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-blue?wid=940&hei=1112&fmt=p-jpg&qlt=80',
    },
    {
      name: 'MacBook Pro M4',
      description: 'Chip M4, pantalla Liquid Retina XDR de 14", 16GB RAM, 512GB SSD. El portátil profesional definitivo.',
      price: 749900000,
      stock: 6,
      imageUrl: 'https://www.apple.com/v/macbook-pro/av/images/overview/artificial-intelligence/ai_apple_intelligence_mac__gdp94bdth9qy_large_2x.jpg',
    },
    {
      name: 'MacBook Air M3',
      description: 'Increíblemente delgado. Chip M3, pantalla Liquid Retina de 15", 16GB RAM, 512GB SSD. Batería de todo el día.',
      price: 649900000,
      stock: 10,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-midnight-select-202306?wid=904&hei=840&fmt=jpeg&qlt=90',
    },
    {
      name: 'iPad Pro M4',
      description: 'El iPad más delgado de la historia. Chip M4, pantalla Ultra Retina XDR OLED de 11", Apple Pencil Pro.',
      price: 549900000,
      stock: 14,
      imageUrl: 'https://www.apple.com/v/ipad-pro/av/images/overview/closer-look/space-black/slide_1A__cxvssgdj2v6u_large_2x.jpg',
    },
    {
      name: 'AirPods Pro 2',
      description: 'Cancelación activa de ruido adaptativa, audio espacial personalizado, chip H2, resistencia al agua IP54.',
      price: 119900000,
      stock: 30,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=940&hei=1112&fmt=p-jpg&qlt=80',
    },
    {
      name: 'Apple Watch Ultra 2',
      description: 'La aventura llama. Caja de titanio de 49mm, GPS + Celular, chip S9, pantalla siempre activa de 3000 nits.',
      price: 389900000,
      stock: 7,
      imageUrl: 'https://www.apple.com/v/apple-watch-ultra-3/b/images/overview/contrast/compare_ultra3__f822bt8bzmqi_large_2x.png',
    },
    {
      name: 'AirPods Max',
      description: 'Audio computacional de alta fidelidad. Cancelación de ruido, audio espacial, chip H1, 20 horas de batería.',
      price: 259900000,
      stock: 9,
      imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=940&hei=1112&fmt=p-jpg&qlt=80',
    },
    // ─── SAMSUNG ───
    {
      name: 'Galaxy S25 Ultra',
      description: 'Lo último de Samsung. Snapdragon 8 Elite, cámara de 200MP, pantalla Dynamic AMOLED 2X de 6.9", S Pen integrado, Galaxy AI.',
      price: 549900000,
      stock: 10,
      imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/co/2501/gallery/co-galaxy-s25-s938-sm-s938bzkjltc-544701007?imbypass=true',
    },
    {
      name: 'Galaxy S25+',
      description: 'Snapdragon 8 Elite, pantalla Dynamic AMOLED 2X de 6.7", cámara de 50MP, Galaxy AI integrada.',
      price: 459900000,
      stock: 12,
      imageUrl: 'https://images.samsung.com/co/smartphones/galaxy-s25/images/galaxy-s25-features-provisual-engine-spec.jpg?imbypass=true',
    },
    {
      name: 'Galaxy S25',
      description: 'Potencia compacta. Snapdragon 8 Elite, pantalla de 6.2", cámara de 50MP, diseño ultraligero.',
      price: 379900000,
      stock: 18,
      imageUrl: 'https://images.samsung.com/is/image/samsung/assets/co/smartphones/galaxy-s25/buy/S25FE_Color_Selection_Navy_PC_1600x864.jpg?imbypass=true',
    },
    {
      name: 'Galaxy Z Fold 6',
      description: 'El plegable definitivo. Pantalla principal de 7.6" + externa de 6.3", Snapdragon 8 Gen 3, S Pen compatible.',
      price: 849900000,
      stock: 5,
      imageUrl: 'https://images.samsung.com/es/smartphones/galaxy-z-fold6/images/galaxy-z-fold6-features-kv.jpg?imbypass=true',
    },
    {
      name: 'Galaxy Z Flip 6',
      description: 'Estilo plegable. Pantalla FlexWindow de 3.4", principal de 6.7", Snapdragon 8 Gen 3, cámara de 50MP.',
      price: 499900000,
      stock: 8,
      imageUrl: 'https://images.samsung.com/co/smartphones/galaxy-z-flip6/images/galaxy-z-flip6-features-kv.jpg?imbypass=true',
    },
    {
      name: 'Galaxy Tab S10 Ultra',
      description: 'La tablet más grande. Pantalla AMOLED de 14.6", chip MediaTek Dimensity 9300+, S Pen incluido, DeX.',
      price: 579900000,
      stock: 6,
      imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/co/sm-x920nzadcoo/gallery/co-galaxy-tab-s10-ultra-sm-x920-sm-x920nzadcoo-543958906?$Q90_1920_1280_F_PNG$',
    },
    {
      name: 'Galaxy Buds 3 Pro',
      description: 'Audio inteligente. Cancelación de ruido adaptativa, 2 vías de altavoces, Blade Light design, IP57.',
      price: 109900000,
      stock: 25,
      imageUrl: 'https://images.samsung.com/is/image/samsung/assets/co/audio-sound/galaxy-buds/2009/galaxy-buds3-pro-welcome-light-pc.jpg?imbypass=true',
    },
    {
      name: 'Galaxy Watch Ultra',
      description: 'Para los más exigentes. Caja de titanio de 47mm, GPS, BioActive Sensor, 100 ATM resistencia al agua.',
      price: 319900000,
      stock: 7,
      imageUrl: 'https://images.samsung.com/es/galaxy-watch-ultra/2507_feature/galaxy-watch-ultra-2025-ocean-water-proof-column01-pc.png?imbypass=true',
    },
    // ─── XIAOMI ───
    {
      name: 'Xiaomi 14 Ultra',
      description: 'Fotografía Leica. Cámara principal de 50MP con óptica Leica Summilux, Snapdragon 8 Gen 3, pantalla AMOLED LTPO de 6.73".',
      price: 459900000,
      stock: 8,
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/new-xiaomi-14-ultra/PC/76f54ee7cfbdca22e420047013bc9d7b.png?f=webp',
    },
    {
      name: 'Xiaomi 14',
      description: 'Compacto y potente. Cámara Leica de 50MP, Snapdragon 8 Gen 3, pantalla AMOLED de 6.36", carga rápida 90W.',
      price: 329900000,
      stock: 15,
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-14t/pc/img-box/img02-1.jpg?f=webp',
    },
    {
      name: 'Redmi Note 13 Pro+',
      description: 'Cámara de 200MP, pantalla AMOLED curva de 6.67", chip MediaTek Dimensity 7200, carga turbo de 120W.',
      price: 159900000,
      stock: 25,
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/redmi-note-13-pro-plus-5g/pc/2420fc6a97eb121f127965177406e6cb.png?f=webp',
    },
    {
      name: 'Xiaomi Pad 6S Pro',
      description: 'Pantalla 3K de 12.4" a 144Hz, Snapdragon 8 Gen 2, 8 altavoces, batería de 10000mAh, stylus compatible.',
      price: 249900000,
      stock: 10,
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-pad-6s-pro-124/pc/e22707982190cc2587fde3afa3d54567.jpg?f=webp',
    },
    {
      name: 'Xiaomi Watch 2 Pro',
      description: 'Wear OS by Google. Pantalla AMOLED de 1.43", GPS, Snapdragon W5+ Gen 1, monitoreo de salud 24/7.',
      price: 149900000,
      stock: 12,
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-2-pro/pc/e8374097060f273dd18353f8373acf6a.png?f=webp',
    },
    {
      name: 'Xiaomi Buds 5 Pro',
      description: 'Audio de alta resolución con LDAC, cancelación de ruido de 52dB, sonido Hi-Res certificado, IP55.',
      price: 89900000,
      stock: 20,
      imageUrl: 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-buds-5-pro/pc/f908d29c21e58d98bd066562ee70a5a3.jpg?f=webp',
    },
  ];

  await productRepository.save(products);
  console.log(`Seeded ${products.length} products successfully`);
}