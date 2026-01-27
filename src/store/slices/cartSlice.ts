import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductVariant } from '@/types/product';

export interface CartItem {
    product: Product;
    quantity: number;
    variant?: ProductVariant;
    unit: string;
    price: number;
    techSpecs?: string;
}

interface CartState {
    items: CartItem[];
    total: number;
    mode: 'RETAIL' | 'WHOLESALE';
}

const initialState: CartState = {
    items: [],
    total: 0,
    mode: 'RETAIL',
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingIndex = state.items.findIndex(
                (item) =>
                    item.product.id === action.payload.product.id &&
                    item.variant?.id === action.payload.variant?.id &&
                    item.unit === action.payload.unit
            );

            if (existingIndex >= 0) {
                state.items[existingIndex].quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }

            state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items.splice(action.payload, 1);
            state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        updateQuantity: (state, action: PayloadAction<{ index: number; quantity: number }>) => {
            if (action.payload.quantity <= 0) {
                state.items.splice(action.payload.index, 1);
            } else {
                state.items[action.payload.index].quantity = action.payload.quantity;
            }
            state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
        setMode: (state, action: PayloadAction<'RETAIL' | 'WHOLESALE'>) => {
            state.mode = action.payload;
        },
    },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setMode } = cartSlice.actions;
export default cartSlice.reducer;
