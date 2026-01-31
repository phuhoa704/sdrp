import { B2COrder } from "@/types/order";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(d);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + "...";
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Format currency based on amount and currency code
 */
export function formatCurrency(amount: number, currencyCode: string = 'vnd'): string {
    return amount.toLocaleString() + (currencyCode.toLowerCase() === 'vnd' ? 'đ' : ` ${currencyCode.toUpperCase()}`);
}

/**
 * Format numbers with commas for display
 */
export function formatDisplayNumber(val: number | string): string {
    if (val === undefined || val === null || val === '') return '';
    const num = val.toString().replace(/[^0-9]/g, '');
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Parse comma-formatted strings back to numbers
 */
export function parseDisplayNumber(val: string): number {
    const cleanValue = val.replace(/[^0-9]/g, '');
    return cleanValue === '' ? 0 : Number(cleanValue);
}


/* 
* Map order to b2c order
*/
export const mapMedusaToB2C = (order: any): B2COrder => ({
    id: order.display_id ? `ORD-${order.display_id}` : (order.id.startsWith('ord_') ? order.id.replace('ord_', 'ORD-') : order.id),
    customer: {
        name: order.customer?.first_name ? `${order.customer.first_name} ${order.customer.last_name || ''}` : (order.email || 'Khách lẻ'),
        phone: order.customer?.phone || order.shipping_address?.phone || '--',
        address: order.shipping_address ? `${order.shipping_address.address_1 || ''}, ${order.shipping_address.city || ''}` : 'Tại quầy'
    },
    date: new Date(order.created_at).toLocaleDateString('vi-VN'),
    timestamp: new Date(order.created_at).getTime(),
    total: order.summary?.accounting_total || order.total || 0,
    status: order.status || 'completed',
    items: order.items?.map((item: any) => ({
        name: item.title || item.product_title || 'Sản phẩm',
        qty: item.quantity,
        price: item.unit_price,
        variant: item.variant_title || 'Default',
        tech_specs: item.variant_sku
    })) || []
});