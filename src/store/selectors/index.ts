import { RootState } from '../index';

// Auth selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Cart selectors
export const selectCart = (state: RootState) => state.cart;
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartMode = (state: RootState) => state.cart.mode;

// UI selectors
export const selectUI = (state: RootState) => state.ui;
export const selectCurrentView = (state: RootState) => state.ui.currentView;
export const selectIsSidebarCollapsed = (state: RootState) => state.ui.isSidebarCollapsed;
export const selectIsDarkMode = (state: RootState) => state.ui.isDarkMode;
export const selectSelectedBranch = (state: RootState) => state.ui.selectedBranch;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectUnreadNotificationCount = (state: RootState) =>
    state.ui.notifications.length;
export const selectSelectedSalesChannelId = (state: RootState) => state.ui.selectedSalesChannelId;

// Products selectors
export const selectProducts = (state: RootState) => state.products;
export const selectAllProducts = (state: RootState) => state.products.items;
export const selectFilteredProducts = (state: RootState) => state.products.filteredItems;
export const selectProductsLoading = (state: RootState) => state.products.isLoading;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectSearchQuery = (state: RootState) => state.products.searchQuery;
export const selectSelectedCategory = (state: RootState) => state.products.selectedCategory;
export const selectProductById = (state: RootState, productId: string) =>
    state.products.items.find((p) => p.id === productId);
export const selectCurrencyCode = (state: RootState) => state.products.currencyCode;
