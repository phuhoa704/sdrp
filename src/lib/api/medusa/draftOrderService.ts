import bridgeClient from '../bridgeClient';
import { DraftOrder, DraftOrderListResponse, CreateDraftOrderPayload } from '@/types/draft-order';
import axios from 'axios';

/**
 * Medusa Draft Order Service
 * Handles draft order related interactions with Medusa Backend
 */

class DraftOrderService {
    /**
     * Get list of draft orders from Medusa Backend
     * @param query Query parameters for filtering and pagination
     */
    async getDraftOrders(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<DraftOrderListResponse> {
        try {
            const res = await bridgeClient.get('/admin/draft-orders', { params: query });
            return res.data as DraftOrderListResponse;
        } catch (error: unknown) {
            console.error('Failed to fetch Medusa draft orders:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch draft orders'
            );
        }
    }

    /**
     * Get a single draft order by ID
     * @param id ID of the draft order
     */
    async getDraftOrder(id: string): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.get(`/admin/draft-orders/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to fetch Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch draft order'
            );
        }
    }

    /**
     * Create a new draft order
     * @param payload Draft order creation data
     */
    async createDraftOrder(payload: CreateDraftOrderPayload): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post('/admin/draft-orders', payload);
            return res.data;
        } catch (error: unknown) {
            console.error('Failed to create Medusa draft order:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create draft order'
            );
        }
    }

    /**
     * Update an existing draft order
     * @param id ID of the draft order to update
     * @param payload Draft order update data
     */
    async updateDraftOrder(id: string, payload: any): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update draft order'
            );
        }
    }

    /**
     * Delete a draft order by ID
     * @param id ID of the draft order to delete
     */
    async deleteDraftOrder(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/draft-orders/${id}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to delete Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete draft order'
            );
        }
    }

    /**
     * Register a draft order as completed
     * @param id ID of the draft order
     */
    async registerCompleted(id: string): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/complete`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to complete Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to complete draft order'
            );
        }
    }

    /**
     * Add a line item to a draft order
     * @param id ID of the draft order
     * @param payload Line item data (variant_id, quantity, metadata, etc.)
     */
    async addLineItem(id: string, payload: {
        variant_id: string;
        quantity: number;
        metadata?: Record<string, unknown>;
        unit_price?: number;
    }): Promise<{ draft_order: DraftOrder }> {
        try {
            // Medusa expects the items in an array even for a single addition
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/edit/items`, {
                items: [payload]
            });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to add line item to Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to add line item'
            );
        }
    }

    /**
     * Create an edit on a draft order
     * @param id ID of the draft order
     */
    async createDraftOrderEdit(id: string): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/edit`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to create edit on Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create draft order edit'
            );
        }
    }

    /**
     * Cancel an edit on a draft order
     * @param id ID of the draft order
     */
    async cancelDraftOrderEdit(id: string): Promise<{ id: string; object: string; deleted: boolean }> {
        try {
            const res = await bridgeClient.delete(`/admin/draft-orders/${id}/edit`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to cancel edit on Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to cancel draft order edit'
            );
        }
    }

    /**
     * Confirm an edit on a draft order
     * @param id ID of the draft order
     */
    async confirmDraftOrderEdit(id: string): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/edit/confirm`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to confirm edit on Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to confirm draft order edit'
            );
        }
    }

    /**
     * Remove a line item from a draft order edit
     * @param id ID of the draft order
     * @param actionId ID of the action (item) to remove
     */
    async removeLineItem(id: string, actionId: string): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.delete(`/admin/draft-orders/${id}/edit/items/${actionId}`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to remove line item from Medusa draft order edit ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to remove line item'
            );
        }
    }

    /**
     * Update a line item in a draft order edit
     * @param id ID of the draft order
     * @param itemId ID of the item to update
     * @param payload Update data (quantity, metadata, etc.)
     */
    async updateLineItem(id: string, itemId: string, payload: {
        quantity?: number;
        metadata?: Record<string, unknown>;
        unit_price?: number;
    }): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/edit/items/item/${itemId}`, payload);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to update line item ${itemId} in Medusa draft order edit ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update line item'
            );
        }
    }

    /**
     * Remove an existing, confirmed line item from a draft order
     * @param id ID of the draft order
     * @param lineItemId ID of the line item to remove
     */
    async removeLineItemFromOrder(id: string, lineItemId: string): Promise<{ draft_order: DraftOrder }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/edit/items/remove`, {
                line_item_id: lineItemId
            });
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to remove line item ${lineItemId} from Medusa draft order ${id}:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to remove line item from order'
            );
        }
    }

    /**
     * Convert a draft order to a real order
     * @param id ID of the draft order
     */
    async convertToOrder(id: string): Promise<{ order: any }> {
        try {
            const res = await bridgeClient.post(`/admin/draft-orders/${id}/convert-to-order`);
            return res.data;
        } catch (error: unknown) {
            console.error(`Failed to convert Medusa draft order ${id} to order:`, error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to convert draft order'
            );
        }
    }
}

export const draftOrderService = new DraftOrderService();
