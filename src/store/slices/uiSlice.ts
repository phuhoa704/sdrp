import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewState } from '@/types/view-state';

interface UIState {
    currentView: ViewState;
    isSidebarCollapsed: boolean;
    isDarkMode: boolean;
    selectedBranch: string;
    selectedSalesChannelId: string | null;
    salesChannelsRefreshTrigger: number;
    notifications: Array<{
        id: string;
        message: string;
        type: 'info' | 'success' | 'warning' | 'error';
        timestamp: number;
    }>;
}

const initialState: UIState = {
    currentView: 'HOME',
    isSidebarCollapsed: true,
    isDarkMode: false,
    selectedBranch: 'Chi nhánh Đồng Tháp',
    selectedSalesChannelId: null,
    salesChannelsRefreshTrigger: 0,
    notifications: [],
};

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        setView: (state, action: PayloadAction<ViewState>) => {
            state.currentView = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarCollapsed = !state.isSidebarCollapsed;
        },
        setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
            state.isSidebarCollapsed = action.payload;
        },
        toggleTheme: (state) => {
            state.isDarkMode = !state.isDarkMode;
        },
        setTheme: (state, action: PayloadAction<boolean>) => {
            state.isDarkMode = action.payload;
        },
        setSelectedBranch: (state, action: PayloadAction<string>) => {
            state.selectedBranch = action.payload;
        },
        setSelectedSalesChannelId: (state, action: PayloadAction<string | null>) => {
            state.selectedSalesChannelId = action.payload;
        },
        refreshSalesChannels: (state) => {
            state.salesChannelsRefreshTrigger = Date.now();
        },
        addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
            state.notifications.push({
                ...action.payload,
                id: Date.now().toString(),
                timestamp: Date.now(),
            });
        },
        removeNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter((n) => n.id !== action.payload);
        },
        clearNotifications: (state) => {
            state.notifications = [];
        },
    },
});

export const {
    setView,
    toggleSidebar,
    setSidebarCollapsed,
    toggleTheme,
    setTheme,
    setSelectedBranch,
    setSelectedSalesChannelId,
    refreshSalesChannels,
    addNotification,
    removeNotification,
    clearNotifications,
} = uiSlice.actions;
export default uiSlice.reducer;
