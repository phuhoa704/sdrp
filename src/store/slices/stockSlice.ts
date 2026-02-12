import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { StockLocation } from '@/types/stock';
import { stockLocationService } from '@/lib/api/medusa/stockLocationService';
import { logout, logoutFromMedusa } from './authSlice';

interface StockState {
    locations: StockLocation[];
    selectedLocationId: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: StockState = {
    locations: [],
    selectedLocationId: null,
    loading: false,
    error: null,
};

export const fetchStockLocations = createAsyncThunk(
    'stock/fetchLocations',
    async (_, { rejectWithValue }) => {
        try {
            const response = await stockLocationService.getStockLocations();
            return response.data.data.map((item) => item.stock_location);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch stock locations');
        }
    }
);

const stockSlice = createSlice({
    name: 'stock',
    initialState,
    reducers: {
        setSelectedLocationId: (state, action: PayloadAction<string | null>) => {
            state.selectedLocationId = action.payload;
        },
        resetStockState: (state) => {
            state.locations = [];
            state.selectedLocationId = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStockLocations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStockLocations.fulfilled, (state, action) => {
                state.loading = false;
                state.locations = action.payload;
                // Auto-select first location if none selected
                if (!state.selectedLocationId && action.payload.length > 0) {
                    state.selectedLocationId = action.payload[0].id;
                }
            })
            .addCase(fetchStockLocations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logout, (state) => {
                state.locations = [];
                state.selectedLocationId = null;
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutFromMedusa.fulfilled, (state) => {
                state.locations = [];
                state.selectedLocationId = null;
                state.loading = false;
                state.error = null;
            });
    },
});

export const { setSelectedLocationId, resetStockState } = stockSlice.actions;
export default stockSlice.reducer;
