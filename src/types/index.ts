export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  images: string[];
  colors: ProductColor[];
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  stockByColor: Record<string, number>;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  selectedColor: ProductColor;
  quantity: number;
}

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
}

export interface Order {
  orderId: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
    address: string;
  };
  items: CartItem[];
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  statusHistory: OrderStatusEvent[];
}


