import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout, logoutFromMedusa } from "./authSlice";

export interface POSItem {
    id: string;
    lineItemId?: string;
    name: string;
    price: number;
    quantity: number;
    variant: string;
    image: string;
    tech_specs?: string;
}

export interface OrderTab {
    id: string;
    label: string;
    items: POSItem[];
    customer: { name: string; phone: string; address?: string } | null;
    discount: number;
    fulfillment: 'pickup' | 'delivery';
    shippingFee: number;
    shippingPartner?: string;
    branch?: string;
    subtotal: number;
}

interface POSState {
    activeTabId: string;
    activeTab: OrderTab | null;
    tabs: OrderTab[];
}

const initialState: POSState = {
    activeTabId: "",
    activeTab: null,
    tabs: [],
}

const posSlice = createSlice({
    name: "pos",
    initialState,
    reducers: {
        setActiveTabId: (state, action: PayloadAction<string>) => {
            state.activeTabId = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<OrderTab>) => {
            state.activeTab = action.payload;
        },
        setTabs: (state, action: PayloadAction<OrderTab[]>) => {
            state.tabs = action.payload;
        },
        addTab: (state, action: PayloadAction<OrderTab>) => {
            state.tabs.push(action.payload);
        },
        removeTab: (state, action: PayloadAction<string>) => {
            state.tabs = state.tabs.filter(tab => tab.id !== action.payload);
        },
        resetPOS: (state) => {
            state.activeTabId = "";
            state.activeTab = null;
            state.tabs = [];
        },
    },
    extraReducers: (builder) => {
        builder.addCase(logout, (state) => {
            state.activeTabId = "";
            state.activeTab = null;
            state.tabs = [];
        });
        builder.addCase(logoutFromMedusa.fulfilled, (state) => {
            state.activeTabId = "";
            state.activeTab = null;
            state.tabs = [];
        });
    }
})

export const { setActiveTabId, setActiveTab, setTabs, addTab, removeTab, resetPOS } = posSlice.actions;
export default posSlice.reducer;