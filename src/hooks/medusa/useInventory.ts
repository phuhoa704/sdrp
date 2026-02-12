import { useEffect, useState, useCallback, useRef } from "react"
import { InventoryItem } from "@/types/inventory-item"
import { inventoryService } from "@/lib/api/medusa/inventoryService"

interface Props {
  autoFetch?: boolean;
  q?: string;
  limit?: number;
  offset?: number;
  debounceMs?: number;
  fields?: string;
}

export const useInventoryItems = (props: Props) => {
  const { autoFetch = true, q, limit, offset, debounceMs = 500, fields } = props;
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchInventoryItems = useCallback(async (query?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      const fetchQuery = query || {
        q,
        limit,
        offset,
        fields
      };
      const response = await inventoryService.getInventoryItems(fetchQuery);
      setInventoryItems(response.inventory_items);
      setCount(response.count);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch inventory items');
    } finally {
      setLoading(false);
    }
  }, [q, limit, offset, fields]);

  useEffect(() => {
    if (!autoFetch) return;

    if (q) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        fetchInventoryItems();
      }, debounceMs);
    } else {
      fetchInventoryItems();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [autoFetch, fetchInventoryItems, q, debounceMs]);

  return {
    inventoryItems,
    loading,
    error,
    count,
    fetchInventoryItems,
    refresh: fetchInventoryItems
  };
}