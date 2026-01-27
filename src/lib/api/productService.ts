import bridgeClient from './bridgeClient';
import { BRIDGE_ENDPOINTS } from './config';

export interface BridgeProduct {
    id: string;
    name: string;
    sku?: string;
    price: number;
    stock_quantity: number;
    image_url?: string;
    description?: string;
    // Add other fields as per the API response
}

export interface BridgeProductResponse {
    products: BridgeProduct[];
    count: number;
    limit: number;
    offset: number;
}

class ProductService {
    /**
     * Get list of products from Bridge API
     */
    async getProducts(): Promise<BridgeProductResponse> {
        const response = await bridgeClient.get<BridgeProductResponse>(BRIDGE_ENDPOINTS.PRODUCTS);
        return response.data;
    }
}

export const productService = new ProductService();
