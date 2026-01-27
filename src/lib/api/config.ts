// Medusa.js API Configuration
export const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || 'http://localhost:8888';
export const MEDUSA_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

// Bridge Backend Configuration
export const BRIDGE_API_URL = process.env.NEXT_PUBLIC_BRIDGE_API_URL || 'https://sdrp-bridge-stg.teknix.services/';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    AUTH_LOGIN: '/auth/customer/emailpass',
    AUTH_REGISTER: '/auth/customer/emailpass/register',
    AUTH_SESSION: '/auth/session',
    AUTH_LOGOUT: '/auth/session',

    // Customer
    CUSTOMER_ME: '/store/customers/me',

    // Products
    PRODUCTS: '/store/products',
    PRODUCT_DETAIL: (id: string) => `/store/products/${id}`,

    // Cart
    CART: '/store/carts',
    CART_DETAIL: (id: string) => `/store/carts/${id}`,

    // Orders
    ORDERS: '/store/orders',
    ORDER_DETAIL: (id: string) => `/store/orders/${id}`,
} as const;

export const BRIDGE_ENDPOINTS = {
    PRODUCTS: '/admin/products',
} as const;

// Request headers
export const getHeaders = (token?: string) => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (MEDUSA_PUBLISHABLE_KEY) {
        headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
};
