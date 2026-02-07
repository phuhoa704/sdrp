import { Customer } from "@/types/customer";
import bridgeClient from "../bridgeClient";
import axios from "axios";
import { getVendorId } from "@/lib/utils";
import { CustomGetResponse, CustomResponse } from "@/types/custom-response";

export interface CustomerGroup {
    id: string;
    name: string;
    metadata: Record<string, any> | null;
    rules: Record<string, any>;
    customers: Customer[];
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface CustomerGroupData {
    customer_group_id: string;
    customer_group: CustomerGroup;
}

export interface CreateCustomerGroup {
    name: string;
    metadata?: Record<string, any> | null;
}

export interface UpdateCustomerGroup {
    name: string;
    metadata?: Record<string, any> | null;
}

export interface ManageCustomerGroup {
    add?: string[];
    remove?: string[];
}

class CustomerGroupService {
    async getCustomerGroups(query?: {
        q?: string;
        limit?: number;
        offset?: number;
        [key: string]: unknown;
    }): Promise<CustomGetResponse<CustomerGroupData>> {
        try {
            const vendorId = getVendorId();
            const response = await bridgeClient.get('/custom/admin/vendors/customer-groups', { params: query, headers: { 'x-api-vendor': vendorId } });
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Medusa customer groups:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch customer groups'
            );
        }
    }

    async getCustomerGroup(customerGroupId: string): Promise<{ customer_group: CustomerGroup }> {
        try {
            const response = await bridgeClient.get(`/admin/customer-groups/${customerGroupId}`);
            return response.data;
        } catch (error) {
            console.error('Failed to fetch Medusa customer group:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to fetch customer group'
            );
        }
    }

    async createCustomerGroup(customerGroup: CreateCustomerGroup): Promise<CustomResponse<CustomerGroup>> {
        try {
            const response = await bridgeClient.post('/admin/customer-groups', customerGroup);
            return response.data;
        } catch (error) {
            console.error('Failed to create Medusa customer group:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to create customer group'
            );
        }
    }

    async updateCustomerGroup(customerGroupId: string, customerGroup: UpdateCustomerGroup): Promise<{ customer_group: CustomerGroup }> {
        try {
            const response = await bridgeClient.put(`/admin/customer-groups/${customerGroupId}`, customerGroup);
            return response.data;
        } catch (error) {
            console.error('Failed to update Medusa customer group:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to update customer group'
            );
        }
    }

    async deleteCustomerGroup(customerGroupId: string): Promise<{
        id: string;
        object: string;
        deleted: true;
    }> {
        try {
            await bridgeClient.delete(`/admin/customer-groups/${customerGroupId}`);
            return { id: customerGroupId, object: 'customer_group', deleted: true };
        } catch (error) {
            console.error('Failed to delete Medusa customer group:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to delete customer group'
            );
        }
    }

    async manageCustomers(customerGroupId: string, manageCustomerGroup: ManageCustomerGroup): Promise<{ customer_group: CustomerGroup }> {
        try {
            const response = await bridgeClient.post(`/admin/customer-groups/${customerGroupId}/customers`, manageCustomerGroup);
            return response.data;
        } catch (error) {
            console.error('Failed to manage Medusa customer group:', error);
            throw new Error(
                axios.isAxiosError(error)
                    ? (error.response?.data as { message?: string } | undefined)?.message || error.message
                    : error instanceof Error
                        ? error.message
                        : 'Failed to manage customer group'
            );
        }
    }
}

export const customerGroupService = new CustomerGroupService();
