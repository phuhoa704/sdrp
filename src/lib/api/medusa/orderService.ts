import bridgeClient from '../bridgeClient';
import axios from 'axios';

/**
 * Medusa Order Service
 * Handles order related interactions with Medusa Backend
 */

class OrderService {
    /**
     * Get list of orders from Medusa Backend
     * @param query Query parameters for filtering and pagination
     */
    async getOrders(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<{ message: string, status: string, data: { orders: any[]; count: number; limit: number; offset: number } }> {
        try {
            const res = await bridgeClient.get('/custom/admin/orders', { params: query });
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa orders:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch orders'
            );
        }
    }

    /**
     * Get a single order by ID
     * @param id ID of the order
     */
    async getOrder(id: string, query?: { [key: string]: unknown }): Promise<{ order: any }> {
        try {
            const res = await bridgeClient.get(`/admin/orders/${id}`, { params: query });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch order'
            );
        }
    }
}

export const orderService = new OrderService();
