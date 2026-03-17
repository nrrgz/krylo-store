import type { Product } from '../types';

const rawProducts: Product[] = [
  // Keyboards
  {
    id: 'p_kb_1',
    name: 'Krylo Pro Mechanical Keyboard',
    brand: 'Krylo',
    description: 'A premium mechanical keyboard with hot-swappable switches, PBT keycaps, and customizable per-key RGB backlighting. Built for productivity and gaming alike.',
    category: 'keyboards',
    price: 149.99,
    rating: 4.8,
    reviewCount: 342,
    images: ['/images/products/keyboard-pro-1.png', '/images/products/keyboard-pro-2.png'],
    imagesByColor: {
      'Obsidian Black': '/images/products/keyboard-pro-1.png',
      'Arctic White': '/images/products/keyboard-pro-2.png',
    },
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Arctic White', hex: '#F3F4F6' },
    ],
    tags: ['mechanical', 'wireless', 'hot-swappable', 'rgb'],
    isFeatured: true,
    createdAt: new Date('2023-10-01T10:00:00Z').toISOString(),
    stockByColor: {
      'Obsidian Black': 45,
      'Arctic White': 20,
    },
  },
  {
    id: 'p_kb_2',
    name: 'Krylo Lite 75%',
    brand: 'Krylo',
    description: 'Compact 75% layout keyboard perfect for minimal desk setups. Features silent linear switches out of the box.',
    category: 'keyboards',
    price: 109.99,
    rating: 4.5,
    reviewCount: 128,
    images: ['/images/products/keyboard-lite-1.png' , '/images/products/keyboard-lite-2.png'],
    imagesByColor: {
      'Graphite': '/images/products/keyboard-lite-1.png',
      'Mint Green': '/images/products/keyboard-lite-2.png',
    },
    colors: [
      { name: 'Graphite', hex: '#374151' },
      { name: 'Mint Green', hex: '#A7F3D0' },
    ],
    tags: ['mechanical', 'compact', '75% layout'],
    isFeatured: false,
    createdAt: new Date('2023-11-15T09:30:00Z').toISOString(),
    stockByColor: {
      'Graphite': 15,
      'Mint Green': 5,
    },
  },
  {
    id: 'p_kb_3',
    name: 'Nimbus Ergo Split',
    brand: 'Nimbus',
    description: 'Ergonomic split keyboard designed to reduce typing fatigue and wrist strain over long coding sessions.',
    category: 'keyboards',
    price: 199.99,
    rating: 4.9,
    reviewCount: 56,
    images: ['/images/products/keyboard-ergo-1.png'],
    colors: [
      { name: 'Matte Black', hex: '#222222' },
    ],
    tags: ['ergonomic', 'split', 'health'],
    isFeatured: false,
    createdAt: new Date('2024-01-20T14:15:00Z').toISOString(),
    stockByColor: {
      'Matte Black': 12,
    },
  },
  {
    id: 'p_kb_4',
    name: 'Aether 60% Wireless',
    brand: 'Aether',
    description: 'Ultra-portable 60% wireless keyboard with Bluetooth 5.2 and a 200-hour battery life.',
    category: 'keyboards',
    price: 89.99,
    rating: 4.3,
    reviewCount: 210,
    images: ['/images/products/keyboard-aether-1.png', '/images/products/keyboard-aether-2.png'],
    imagesByColor: {
      'Cyber Yellow': '/images/products/keyboard-aether-1.png',
      'Ghost White': '/images/products/keyboard-aether-2.png',
    },
    colors: [
      { name: 'Cyber Yellow', hex: '#FBBF24' },
      { name: 'Ghost White', hex: '#F9FAFB' },
    ],
    tags: ['60%', 'wireless', 'portable'],
    isFeatured: false,
    createdAt: new Date('2023-09-05T08:00:00Z').toISOString(),
    stockByColor: {
      'Cyber Yellow': 30,
      'Ghost White': 40,
    },
  },
  {
    id: 'p_kb_5',
    name: 'Krylo Creator Board',
    brand: 'Krylo',
    description: 'Full-sized keyboard featuring dedicated macro keys and a programmable rotary encoder dial for creative professionals.',
    category: 'keyboards',
    price: 179.99,
    rating: 4.7,
    reviewCount: 89,
    images: ['/images/products/keyboard-creator-1.png'],
    colors: [
      { name: 'Space Gray', hex: '#4B5563' },
    ],
    tags: ['full-size', 'macro', 'creators', 'dial'],
    isFeatured: true,
    createdAt: new Date('2024-02-10T11:00:00Z').toISOString(),
    stockByColor: {
      'Space Gray': 25,
    },
  },

  // Mice
  {
    id: 'p_mi_1',
    name: 'Krylo Precision Mouse',
    brand: 'Krylo',
    description: 'Ergonomic wireless mouse with a 26K DPI optical sensor and magnetic scroll wheel.',
    category: 'mice',
    price: 89.99,
    rating: 4.6,
    reviewCount: 412,
    images: ['/images/products/mouse-precision-1.png' , '/images/products/mouse-precision-2.png'],
    imagesByColor: {
      'Obsidian Black': '/images/products/mouse-precision-1.png',
      'Arctic White': '/images/products/mouse-precision-2.png',
    },
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Arctic White', hex: '#F3F4F6' },
    ],
    tags: ['wireless', 'ergonomic', 'productivity'],
    isFeatured: true,
    createdAt: new Date('2023-12-01T10:00:00Z').toISOString(),
    stockByColor: {
      'Obsidian Black': 60,
      'Arctic White': 35,
    },
  },
  {
    id: 'p_mi_2',
    name: 'AeroLight Gaming Mouse',
    brand: 'Aero',
    description: 'Ultra-lightweight gaming mouse weighing only 55g, featuring PTFE feet and a flexible paracord cable.',
    category: 'mice',
    price: 69.99,
    rating: 4.8,
    reviewCount: 220,
    images: ['/images/products/mouse-aero-1.png' , '/images/products/mouse-aero-2.png'],
    imagesByColor: {
      'Neon Pink': '/images/products/mouse-aero-1.png',
      'Cyan Blue': '/images/products/mouse-aero-2.png',
    },
    colors: [
      { name: 'Neon Pink', hex: '#EC4899' },
      { name: 'Cyan Blue', hex: '#06B6D4' },
    ],
    tags: ['gaming', 'lightweight', 'wired'],
    isFeatured: false,
    createdAt: new Date('2024-01-05T09:00:00Z').toISOString(),
    stockByColor: {
      'Neon Pink': 15,
      'Cyan Blue': 20,
    },
  },
  {
    id: 'p_mi_3',
    name: 'Krylo Trackball Ergo',
    brand: 'Krylo',
    description: 'Advanced trackball mouse designed to relieve wrist pain and minimize desk space usage.',
    category: 'mice',
    price: 99.99,
    rating: 4.4,
    reviewCount: 95,
    images: ['/images/products/mouse-trackball-1.png'],
    colors: [
      { name: 'Graphite', hex: '#374151' },
    ],
    tags: ['trackball', 'ergonomic', 'wireless'],
    isFeatured: false,
    createdAt: new Date('2023-08-20T14:30:00Z').toISOString(),
    stockByColor: {
      'Graphite': 40,
    },
  },
  {
    id: 'p_mi_4',
    name: 'Nimbus Travel Mouse',
    brand: 'Nimbus',
    description: 'Compact and slim profile mouse that easily slips into any laptop bag or sleeve.',
    category: 'mice',
    price: 39.99,
    rating: 4.2,
    reviewCount: 310,
    images: ['/images/products/mouse-travel-1.png' , '/images/products/mouse-travel-2.png'],
    imagesByColor: {
      'Silver': '/images/products/mouse-travel-1.png',
      'Midnight Blue': '/images/products/mouse-travel-2.png',
    },
    colors: [
      { name: 'Silver', hex: '#D1D5DB' },
      { name: 'Midnight Blue', hex: '#1E3A8A' },
    ],
    tags: ['travel', 'compact', 'bluetooth'],
    isFeatured: false,
    createdAt: new Date('2023-10-15T16:45:00Z').toISOString(),
    stockByColor: {
      'Silver': 80,
      'Midnight Blue': 45,
    },
  },
  {
    id: 'p_mi_5',
    name: 'Krylo Master Vertical',
    brand: 'Krylo',
    description: 'Vertical mouse engineered to keep your hand in a natural handshake position.',
    category: 'mice',
    price: 75.99,
    rating: 4.7,
    reviewCount: 160,
    images: ['/images/products/mouse-vertical-1.png'],
    colors: [
      { name: 'Matte Black', hex: '#222222' },
    ],
    tags: ['vertical', 'ergonomic', 'health'],
    isFeatured: false,
    createdAt: new Date('2024-02-05T10:20:00Z').toISOString(),
    stockByColor: {
      'Matte Black': 30,
    },
  },

  // Audio
  {
    id: 'p_au_1',
    name: 'Krylo SoundScape ANC',
    brand: 'Krylo',
    description: 'Over-ear wireless headphones with industry-leading Active Noise Cancellation and 40-hour battery life.',
    category: 'audio',
    price: 249.99,
    rating: 4.9,
    reviewCount: 512,
    images: ['/images/products/audio-anc-1.png' , '/images/products/audio-anc-2.png'],
    imagesByColor: {
      'Obsidian Black': '/images/products/audio-anc-1.png',
      'Sandstone': '/images/products/audio-anc-2.png',
    },
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Sandstone', hex: '#D6D3D1' },
    ],
    tags: ['headphones', 'anc', 'wireless', 'over-ear'],
    isFeatured: true,
    createdAt: new Date('2023-11-20T09:00:00Z').toISOString(),
    stockByColor: {
      'Obsidian Black': 50,
      'Sandstone': 25,
    },
  },
  {
    id: 'p_au_2',
    name: 'Sonicbuds Pro',
    brand: 'Sonic',
    description: 'True wireless earbuds delivering high-fidelity audio, spatial sound, and multipoint connection.',
    category: 'audio',
    price: 149.99,
    rating: 4.6,
    reviewCount: 380,
    images: ['/images/products/audio-buds-1.png' , '/images/products/audio-buds-2.png'],
    imagesByColor: {
      'Gloss White': '/images/products/audio-buds-1.png',
      'Midnight': '/images/products/audio-buds-2.png',
    },
    colors: [
      { name: 'Gloss White', hex: '#FFFFFF' },
      { name: 'Midnight', hex: '#0F172A' },
    ],
    tags: ['earbuds', 'tws', 'wireless'],
    isFeatured: false,
    createdAt: new Date('2024-01-10T11:30:00Z').toISOString(),
    stockByColor: {
      'Gloss White': 100,
      'Midnight': 75,
    },
  },
  {
    id: 'p_au_3',
    name: 'Krylo Studio Monitor',
    brand: 'Krylo',
    description: 'Wired studio headphones providing a flat, neutral sound profile for music production and critical listening.',
    category: 'audio',
    price: 189.99,
    rating: 4.8,
    reviewCount: 145,
    images: ['/images/products/audio-studio-1.png'],
    colors: [
      { name: 'Classic Black', hex: '#18181B' },
    ],
    tags: ['headphones', 'wired', 'studio', 'audiophile'],
    isFeatured: false,
    createdAt: new Date('2023-07-14T08:15:00Z').toISOString(),
    stockByColor: {
      'Classic Black': 40,
    },
  },
  {
    id: 'p_au_4',
    name: 'Acoustic Desktop Speakers',
    brand: 'Acoustic',
    description: 'Compact 2.0 Bluetooth desktop speakers featuring wood accents and surprisingly deep bass.',
    category: 'audio',
    price: 119.99,
    rating: 4.5,
    reviewCount: 215,
    images: ['/images/products/audio-speakers-1.png' , '/images/products/audio-speakers-2.png'],
    imagesByColor: {
      'Walnut': '/images/products/audio-speakers-1.png',
      'Oak': '/images/products/audio-speakers-2.png',
    },
    colors: [
      { name: 'Walnut', hex: '#78350F' },
      { name: 'Oak', hex: '#B45309' },
    ],
    tags: ['speakers', 'desktop', 'bluetooth'],
    isFeatured: false,
    createdAt: new Date('2023-09-22T13:40:00Z').toISOString(),
    stockByColor: {
      'Walnut': 20,
      'Oak': 15,
    },
  },
  {
    id: 'p_au_5',
    name: 'Krylo Cast Boom Arm & Mic',
    brand: 'Krylo',
    description: 'Professional USB condenser microphone bundle with a low-profile boom arm, perfect for streaming and podcasts.',
    category: 'audio',
    price: 159.99,
    rating: 4.7,
    reviewCount: 188,
    images: ['/images/products/audio-mic-1.png'],
    colors: [
      { name: 'Matte Black', hex: '#222222' },
    ],
    tags: ['microphone', 'streaming', 'usb', 'bundle'],
    isFeatured: true,
    createdAt: new Date('2024-02-18T10:00:00Z').toISOString(),
    stockByColor: {
      'Matte Black': 30,
    },
  },

  // Charging / Cables
  {
    id: 'p_ch_1',
    name: 'Krylo GaN 100W Hub',
    brand: 'Krylo',
    description: 'Ultra-compact 100W Gallium Nitride charger with 3 USB-C ports and 1 USB-A port. Fast charge all your devices simultaneously.',
    category: 'charging',
    price: 69.99,
    rating: 4.8,
    reviewCount: 650,
    images: ['/images/products/charging-gan-1.png' , '/images/products/charging-gan-2.png'],
    imagesByColor: {
      'Space Gray': '/images/products/charging-gan-1.png',
      'Arctic White': '/images/products/charging-gan-2.png',
    },
    colors: [
      { name: 'Space Gray', hex: '#4B5563' },
      { name: 'Arctic White', hex: '#F3F4F6' },
    ],
    tags: ['charger', 'GaN', '100W', 'usb-c'],
    isFeatured: true,
    createdAt: new Date('2023-08-11T09:20:00Z').toISOString(),
    stockByColor: {
      'Space Gray': 120,
      'Arctic White': 85,
    },
  },
  {
    id: 'p_ch_2',
    name: 'Volt Wireless Pad 3-in-1',
    brand: 'Volt',
    description: 'Minimalist charging station for your phone, watch, and earbuds. Made from premium anodized aluminum.',
    category: 'charging',
    price: 89.99,
    rating: 4.5,
    reviewCount: 320,
    images: ['/images/products/charging-pad-1.png' , '/images/products/charging-pad-2.png'],
    imagesByColor: {
      'Silver': '/images/products/charging-pad-1.png',
      'Black': '/images/products/charging-pad-2.png',
    },
    colors: [
      { name: 'Silver', hex: '#D1D5DB' },
      { name: 'Black', hex: '#111111' },
    ],
    tags: ['wireless', 'charging station', 'magsafe compatible'],
    isFeatured: false,
    createdAt: new Date('2023-11-05T14:10:00Z').toISOString(),
    stockByColor: {
      'Silver': 45,
      'Black': 60,
    },
  },
  {
    id: 'p_ca_1',
    name: 'Krylo Titan Braided USB-C Cable',
    brand: 'Krylo',
    description: 'Incredibly durable 2-meter nylon braided USB-C to USB-C cable supporting up to 240W power delivery and 40Gbps data transfer.',
    category: 'cables',
    price: 24.99,
    rating: 4.9,
    reviewCount: 890,
    images: ['/images/products/cable-titan-1.png' , '/images/products/cable-titan-2.png' , '/images/products/cable-titan-3.png'],
    imagesByColor: {
      'Charcoal': '/images/products/cable-titan-1.png',
      'Crimson': '/images/products/cable-titan-2.png',
      'Navy': '/images/products/cable-titan-3.png',
    },
    colors: [
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Crimson', hex: '#DC2626' },
      { name: 'Navy', hex: '#1E3A8A' },
    ],
    tags: ['cable', 'braided', 'usb-c', 'durable'],
    isFeatured: false,
    createdAt: new Date('2023-05-18T08:30:00Z').toISOString(),
    stockByColor: {
      'Charcoal': 300,
      'Crimson': 150,
      'Navy': 200,
    },
  },
  {
    id: 'p_ca_2',
    name: 'Volt MagSafe Compatible Cable',
    brand: 'Volt',
    description: 'Magnetic snap-on charging cable for seamless alignment and fast charging.',
    category: 'cables',
    price: 29.99,
    rating: 4.4,
    reviewCount: 145,
    images: ['/images/products/cable-mag-1.png'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
    ],
    tags: ['cable', 'magnetic', 'fast-charging'],
    isFeatured: false,
    createdAt: new Date('2024-01-25T11:00:00Z').toISOString(),
    stockByColor: {
      'White': 110,
    },
  },
  {
    id: 'p_ca_3',
    name: 'Krylo Coiled Aviator Cable',
    brand: 'Krylo',
    description: 'Premium custom coiled keyboard cable with an aviator connector to complete the aesthetic of your mechanical keyboard setup.',
    category: 'cables',
    price: 45.99,
    rating: 4.7,
    reviewCount: 230,
    images: ['/images/products/cable-coil-1.png' , '/images/products/cable-coil-2.png' , '/images/products/cable-coil-3.png'],
    imagesByColor: {
      'Lazer Purple': '/images/products/cable-coil-1.png',
      'Mint': '/images/products/cable-coil-2.png',
      'Carbon Black': '/images/products/cable-coil-3.png',
    },
    colors: [
      { name: 'Lazer Purple', hex: '#8B5CF6' },
      { name: 'Mint', hex: '#6EE7B7' },
      { name: 'Carbon Black', hex: '#1F2937' },
    ],
    tags: ['cable', 'coiled', 'keyboard mod', 'aviator'],
    isFeatured: true,
    createdAt: new Date('2023-10-28T16:20:00Z').toISOString(),
    stockByColor: {
      'Lazer Purple': 40,
      'Mint': 35,
      'Carbon Black': 60,
    },
  },

  // Desk
  {
    id: 'p_dk_1',
    name: 'Krylo Merino Wool Desk Mat',
    brand: 'Krylo',
    description: 'Thick, premium merino wool desk pad that adds warmth, texture, and organization to your workspace.',
    category: 'desk',
    price: 59.99,
    rating: 4.8,
    reviewCount: 420,
    images: ['/images/products/desk-mat-wool-1.png' , '/images/products/desk-mat-wool-2.png' , '/images/products/desk-mat-wool-3.png'],
    imagesByColor: {
      'Light Gray': '/images/products/desk-mat-wool-1.png',
      'Charcoal': '/images/products/desk-mat-wool-2.png',
      'Forest Green': '/images/products/desk-mat-wool-3.png',
    },
    colors: [
      { name: 'Light Gray', hex: '#D1D5DB' },
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Forest Green', hex: '#064E3B' },
    ],
    tags: ['desk mat', 'wool', 'workspace'],
    isFeatured: true,
    createdAt: new Date('2023-11-12T08:00:00Z').toISOString(),
    stockByColor: {
      'Light Gray': 80,
      'Charcoal': 110,
      'Forest Green': 45,
    },
  },
  {
    id: 'p_dk_2',
    name: 'Aluma Monitor Stand',
    brand: 'Aluma',
    description: 'Sleek aluminum base lift to elevate your monitor to an ergonomic viewing height, creating extra storage space underneath.',
    category: 'desk',
    price: 79.99,
    rating: 4.6,
    reviewCount: 290,
    images: ['/images/products/desk-stand-1.png' , '/images/products/desk-stand-2.png'],
    imagesByColor: {
      'Silver': '/images/products/desk-stand-1.png',
      'Space Gray': '/images/products/desk-stand-2.png',
    },
    colors: [
      { name: 'Silver', hex: '#E5E7EB' },
      { name: 'Space Gray', hex: '#4B5563' },
    ],
    tags: ['monitor stand', 'ergonomics', 'aluminum', 'storage'],
    isFeatured: false,
    createdAt: new Date('2023-12-05T10:45:00Z').toISOString(),
    stockByColor: {
      'Silver': 50,
      'Space Gray': 65,
    },
  },
];

const validateImagesByColor = (product: Product): Product => {
  if (!product.imagesByColor) return product;

  const colorSet = new Set(product.colors.map((color) => color.name));
  const imageSet = new Set(product.images);
  const sanitized: Record<string, string> = {};
  const invalidMappings: string[] = [];

  for (const [colorName, imagePath] of Object.entries(product.imagesByColor)) {
    if (!colorSet.has(colorName) || !imageSet.has(imagePath)) {
      invalidMappings.push(`${colorName} -> ${imagePath}`);
      continue;
    }
    sanitized[colorName] = imagePath;
  }

  const hostname = (globalThis as { location?: { hostname?: string } }).location?.hostname;
  const isLocalDev = hostname === 'localhost' || hostname === '127.0.0.1';

  if (invalidMappings.length > 0 && isLocalDev) {
    console.warn(
      `[products] Invalid imagesByColor mappings for "${product.id}": ${invalidMappings.join(', ')}`,
    );
  }

  const hasMappings = Object.keys(sanitized).length > 0;
  return {
    ...product,
    imagesByColor: hasMappings ? sanitized : undefined,
  };
};

export const products: Product[] = rawProducts.map(validateImagesByColor);

