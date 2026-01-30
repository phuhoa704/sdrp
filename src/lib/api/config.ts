
export const BRIDGE_API_URL = process.env.NEXT_PUBLIC_BRIDGE_API_URL || 'https://sdrp-bridge-stg.teknix.services/';

export const API_ENDPOINTS = {
    AUTH_LOGIN: '/auth/user/emailpass',
    AUTH_SESSION: '/auth/session',

    ADMIN_ME: '/admin/users/me',
    ADMIN_USER_DETAIL: (id: string) => `/admin/users/${id}`,

    STORE_CUSTOMERS: '/store/customers',
    STORE_CUSTOMER_ME: '/store/customers/me',

    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_PRODUCT_DETAIL: (id: string) => `/admin/products/${id}`,
    ADMIN_PRODUCT_VARIANTS: (productId: string) => `/admin/products/${productId}/variants`,
    ADMIN_PRODUCT_VARIANT_DETAIL: (productId: string, variantId: string) =>
        `/admin/products/${productId}/variants/${variantId}`,

    STORE_CATEGORIES: '/store/product-categories',
    STORE_CATEGORY_DETAIL: (idOrHandle: string) => `/store/product-categories/${idOrHandle}`,

    ADMIN_PRODUCT_TAGS: '/admin/product-tags',

    ADMIN_SALES_CHANNELS: '/admin/sales-channels',
    ADMIN_SALES_CHANNEL_DETAIL: (id: string) => `/admin/sales-channels/${id}`,

    ADMIN_STOCK_LOCATIONS: '/admin/stock-locations',
    ADMIN_STOCK_LOCATION_DETAIL: (id: string) => `/admin/stock-locations/${id}`,

    ADMIN_UPLOADS: '/admin/uploads',
    ADMIN_UPLOAD_DETAIL: (key: string) => `/admin/uploads/${key}`,

    CART: '/store/carts',
    CART_DETAIL: (id: string) => `/store/carts/${id}`,

    ORDERS: '/store/orders',
    ORDER_DETAIL: (id: string) => `/store/orders/${id}`,
} as const;

export const BRIDGE_ENDPOINTS = {
    PRODUCTS: '/admin/products',
} as const;

