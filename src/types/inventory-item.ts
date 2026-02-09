import { Product, ProductVariant } from "./product";

export interface InventoryItemVariant extends ProductVariant {
  product?: Product;
}

export interface StockLocation {
  id: string;
  name: string;
}

export interface InventoryLevel {
  id: string;
  location_id: string;
  available_quantity: number;
  stocked_quantity: number;
  reserved_quantity: number;
  incoming_quantity: number;
  metadata: Record<string, any> | null;
  created_at: string;
  updated_at: string;
  stock_locations?: StockLocation[];
}

export interface InventoryItem {
  id: string;
  sku: string | null;
  title: string | null;
  description: string | null;
  thumbnail: string | null;
  origin_country: string | null;
  hs_code: string | null;
  requires_shipping: boolean;
  mid_code: string | null;
  material: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  metadata: Record<string, any> | null;
  reserved_quantity: number;
  stocked_quantity: number;
  created_at: string;
  updated_at: string;
  location_levels: InventoryLevel[];
  variants: InventoryItemVariant[];
}