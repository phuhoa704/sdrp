import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserRole } from '@/types/enum';
import { authService, LoginCredentials, RegisterData, MedusaCustomer } from '@/lib/api/auth';

interface AuthState {
    isAuthenticated: boolean;
    user: {
        id: string;
        name: string;
        email: string;
        role: UserRole;
        avatarUrl?: string;
    } | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
};

// Helper to map Medusa customer to our user format
const mapMedusaCustomerToUser = (customer: MedusaCustomer) => ({
    id: customer.id,
    name: `${customer.first_name} ${customer.last_name}`.trim() || customer.email,
    email: customer.email,
    role: (customer.metadata?.role as UserRole) || UserRole.RETAILER,
    avatarUrl: customer.metadata?.avatar_url as string | undefined,
});

// Async thunks
export const loginWithMedusa = createAsyncThunk(
    'auth/loginWithMedusa',
    async (credentials: LoginCredentials, { rejectWithValue }) => {
        try {
            const response = await authService.login(credentials);
            return {
                user: mapMedusaCustomerToUser(response.customer),
                token: response.token,
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
        }
    }
);

export const registerWithMedusa = createAsyncThunk(
    'auth/registerWithMedusa',
    async (data: RegisterData, { rejectWithValue }) => {
        try {
            const response = await authService.register(data);
            return {
                user: mapMedusaCustomerToUser(response.customer),
                token: response.token,
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
        }
    }
);

export const fetchSession = createAsyncThunk(
    'auth/fetchSession',
    async (token: string, { rejectWithValue }) => {
        try {
            const response = await authService.getSession(token);
            return {
                user: mapMedusaCustomerToUser(response.customer),
            };
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'Session expired');
        }
    }
);

export const logoutFromMedusa = createAsyncThunk(
    'auth/logoutFromMedusa',
    async (token: string, { rejectWithValue }) => {
        try {
            await authService.logout(token);
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout API error:', error);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Keep existing actions for backward compatibility
        login: (state, action: PayloadAction<{ user: AuthState['user']; token: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.error = null;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<Partial<NonNullable<AuthState['user']>>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Login
        builder
            .addCase(loginWithMedusa.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginWithMedusa.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(loginWithMedusa.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Register
        builder
            .addCase(registerWithMedusa.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerWithMedusa.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(registerWithMedusa.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // Fetch session
        builder
            .addCase(fetchSession.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSession.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
            })
            .addCase(fetchSession.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
            });

        // Logout
        builder
            .addCase(logoutFromMedusa.fulfilled, (state) => {
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = null;
            });
    },
});

export const { login, logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;
