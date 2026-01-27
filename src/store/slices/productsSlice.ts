import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';

interface ProductsState {
    items: Product[];
    filteredItems: Product[];
    searchQuery: string;
    selectedCategory: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    items: [],
    filteredItems: [],
    searchQuery: '',
    selectedCategory: null,
    isLoading: false,
    error: null,
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.items = action.payload;
            state.filteredItems = action.payload;
            state.isLoading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
            state.filteredItems = state.items.filter((product) =>
                product.name.toLowerCase().includes(action.payload.toLowerCase()) ||
                product.category.toLowerCase().includes(action.payload.toLowerCase()) ||
                product.active_ingredient.toLowerCase().includes(action.payload.toLowerCase())
            );
        },
        setSelectedCategory: (state, action: PayloadAction<string | null>) => {
            state.selectedCategory = action.payload;
            if (action.payload) {
                state.filteredItems = state.items.filter((product) => product.category === action.payload);
            } else {
                state.filteredItems = state.items;
            }
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.items.findIndex((p) => p.id === action.payload.id);
            if (index >= 0) {
                state.items[index] = action.payload;
                state.filteredItems = state.items;
            }
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
            state.filteredItems = state.items;
        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((p) => p.id !== action.payload);
            state.filteredItems = state.items;
        },
    },
});

export const {
    setProducts,
    setLoading,
    setError,
    setSearchQuery,
    setSelectedCategory,
    updateProduct,
    addProduct,
    deleteProduct,
} = productsSlice.actions;
export default productsSlice.reducer;
