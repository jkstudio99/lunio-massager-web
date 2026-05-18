import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  nameEn: string;
  image: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface OrderState {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

// Mock data for demo
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'LN-20250515-001',
    date: '2025-05-15',
    status: 'shipped',
    items: [
      {
        productId: '1',
        name: 'Lunio 小腿按摩器 Pro',
        nameEn: 'Calf Massager Pro',
        image: '/img/products/calf-pro/hero.webp',
        price: 4980,
        quantity: 1,
        slug: 'calf-massager-pro',
      },
    ],
    subtotal: 4980,
    shipping: 0,
    discount: 0,
    total: 4980,
    shippingAddress: '台北市大安區忠孝東路四段123號',
    trackingNumber: 'SF1234567890',
    estimatedDelivery: '2025-05-20',
  },
  {
    id: '2',
    orderNumber: 'LN-20250510-002',
    date: '2025-05-10',
    status: 'delivered',
    items: [
      {
        productId: '2',
        name: 'Lunio 氣壓式靴型腿部按摩器',
        nameEn: 'Air Boot Massager',
        image: '/img/products/boot/hero.webp',
        price: 6980,
        quantity: 1,
        slug: 'air-boot-massager',
      },
      {
        productId: '3',
        name: 'Lunio 頸肩揉捏按摩器',
        nameEn: 'Neck & Shoulder Massager',
        image: '/img/products/neck/hero.webp',
        price: 3980,
        quantity: 1,
        slug: 'neck-shoulder-massager',
      },
    ],
    subtotal: 10960,
    shipping: 0,
    discount: -500,
    total: 10460,
    shippingAddress: '台中市西區台灣大道二段456號',
    trackingNumber: 'SF0987654321',
  },
  {
    id: '3',
    orderNumber: 'LN-20250518-003',
    date: '2025-05-18',
    status: 'pending',
    items: [
      {
        productId: '4',
        name: 'Lunio 眼部溫感按摩器',
        nameEn: 'Eye Massager',
        image: '/img/products/eye/hero.webp',
        price: 2980,
        quantity: 2,
        slug: 'eye-massager',
      },
    ],
    subtotal: 5960,
    shipping: 0,
    discount: 0,
    total: 5960,
    shippingAddress: '高雄市前鎮區中山路789號',
  },
];

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: mockOrders,

      addOrder: (order) =>
        set((state) => ({
          orders: [{ ...order, id: crypto.randomUUID() }, ...state.orders],
        })),

      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    }),
    {
      name: 'lunio-orders',
    }
  )
);
