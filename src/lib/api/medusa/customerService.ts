import { Customer } from "@/types/customer";
import bridgeClient from "../bridgeClient";
import axios from "axios";

interface CreateCustomerData {
    email: string;
    phone: string;
    first_name: string;
    last_name: string;
    company_name: string;
    metadata?: Record<string, any>;
}

class CustomerService {
    async getCustomers(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<{ customers: Customer[], count: number, offset: number, limit: number }> {
        try {
            const response = await bridgeClient.get('/admin/customers', { params: query });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Medusa customers:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch customers'
            );
        }
    }

    async getCustomer(id: string): Promise<{ customer: Customer }> {
        try {
            const response = await bridgeClient.get(`/admin/customers/${id}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Medusa customer:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch customer'
            );
        }
    }

    async createCustomer(data: CreateCustomerData): Promise<{ customer: Customer }> {
        try {
            const response = await bridgeClient.post('/admin/customers', data);
            return response.data;
        } catch (error) {
            console.error('Failed to create Medusa customer:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create customer'
            );
        }
    }

    async updateCustomer(id: string, data: CreateCustomerData): Promise<{ customer: Customer }> {
        try {
            const response = await bridgeClient.post(`/admin/customers/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update Medusa customer:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update customer'
            );
        }
    }

    async deleteCustomer(id: string): Promise<{ success: boolean }> {
        try {
            await bridgeClient.delete(`/admin/customers/${id}`);
            return { success: true };
        } catch (error) {
            console.error('Failed to delete Medusa customer:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete customer'
            );
        }
    }
}

export const customerService = new CustomerService();