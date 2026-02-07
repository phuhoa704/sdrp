import { useState, useEffect, useCallback } from 'react';
import { customerGroupService, CustomerGroup } from '@/lib/api/medusa/customerGroupService';
import { useToast } from '@/contexts/ToastContext';

interface Props {
    q?: string;
    limit?: number;
    offset?: number;
    fields?: string;
}

export const useCustomerGroups = (props: Props) => {
    const { showToast } = useToast();
    const { q, limit, offset, fields } = props;
    const [customerGroups, setCustomerGroups] = useState<CustomerGroup[]>([]);
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCustomerGroups = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await customerGroupService.getCustomerGroups({ q, limit, offset, fields });
            setCustomerGroups(data.data.data.map((item) => item.customer_group));
            setCount(data.data.pagination.count);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch customer groups');
        } finally {
            setLoading(false);
        }
    }, [q, limit, offset, fields]);

    useEffect(() => {
        fetchCustomerGroups();
    }, [fetchCustomerGroups]);

    const deleteCustomerGroup = useCallback(async (customerGroupId: string) => {
        setLoading(true);
        setError(null);
        try {
            await customerGroupService.deleteCustomerGroup(customerGroupId);
            fetchCustomerGroups();
            showToast('Xóa nhóm khách hàng thành công', 'success');
        } catch (err: any) {
            setError(err.message || 'Failed to delete customer group');
            showToast(err.message || 'Failed to delete customer group', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        customerGroups,
        count,
        loading,
        error,
        refresh: fetchCustomerGroups,
        deleteCustomerGroup
    };
};
