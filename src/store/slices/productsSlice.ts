import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product } from '@/types/product';

interface ProductsState {
    items: Product[];
    filteredItems: Product[];
    searchQuery: string;
    selectedCategory: string | null;
    isLoading: boolean;
    error: string | null;
    pagination: {
        limit: number;
        offset: number;
        count: number;
    };
    currencyCode: string;
}

const initialState: ProductsState = {
    items: [],
    filteredItems: [],
    searchQuery: '',
    selectedCategory: null,
    isLoading: false,
    error: null,
    pagination: {
        limit: 10,
        offset: 0,
        count: 0,
    },
    currencyCode: "vnd",
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<{ products: Product[], count: number }>) => {
            state.items = action.payload.products;
            state.filteredItems = action.payload.products;
            state.pagination.count = action.payload.count;
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
            state.filteredItems = state.items.filter((product) => {
                const title = product.title || "";
                const category = (product.type as any)?.value || "";
                const activeIngredient = (product as any).metadata?.active_ingredient || product.variants?.[0]?.metadata?.active_ingredient || "";

                return (
                    title.toLowerCase().includes(action.payload.toLowerCase()) ||
                    category.toLowerCase().includes(action.payload.toLowerCase()) ||
                    activeIngredient.toLowerCase().includes(action.payload.toLowerCase())
                );
            });
        },
        setSelectedCategory: (state, action: PayloadAction<string | null>) => {
            state.selectedCategory = action.payload;
            if (action.payload) {
                state.filteredItems = state.items.filter((product) => {
                    const category = (product.type as any)?.value || "";
                    return category === action.payload;
                });
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
        setPagination: (state, action: PayloadAction<Partial<ProductsState['pagination']>>) => {
            state.pagination = { ...state.pagination, ...action.payload };
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
    setPagination,
} = productsSlice.actions;
export default productsSlice.reducer;
