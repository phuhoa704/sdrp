import { MEDUSA_BACKEND_URL, API_ENDPOINTS, getHeaders } from './config';

export interface MedusaAuthResponse {
    customer: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        has_account: boolean;
        metadata?: Record<string, unknown>;
    };
    token: string;
}

export interface MedusaCustomer {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    has_account: boolean;
    metadata?: {
        role?: 'RETAILER' | 'SELLER' | 'ADMIN';
        avatar_url?: string;
        [key: string]: unknown;
    };
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    first_name: string;
    last_name: string;
}

class AuthService {
    /**
     * Login with email and password
     */
    async login(credentials: LoginCredentials): Promise<MedusaAuthResponse> {
        const response = await fetch(`${MEDUSA_BACKEND_URL}${API_ENDPOINTS.AUTH_LOGIN}`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include', // Important for cookies
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Login failed' }));
            throw new Error(error.message || 'Invalid credentials');
        }

        return response.json();
    }

    /**
     * Register new customer
     */
    async register(data: RegisterData): Promise<MedusaAuthResponse> {
        const response = await fetch(`${MEDUSA_BACKEND_URL}${API_ENDPOINTS.AUTH_REGISTER}`, {
            method: 'POST',
            headers: getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Registration failed' }));
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    }

    /**
     * Get current session
     */
    async getSession(token: string): Promise<{ customer: MedusaCustomer }> {
        const response = await fetch(`${MEDUSA_BACKEND_URL}${API_ENDPOINTS.AUTH_SESSION}`, {
            method: 'GET',
            headers: getHeaders(token),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Session expired');
        }

        return response.json();
    }

    /**
     * Logout
     */
    async logout(token: string): Promise<void> {
        const response = await fetch(`${MEDUSA_BACKEND_URL}${API_ENDPOINTS.AUTH_LOGOUT}`, {
            method: 'DELETE',
            headers: getHeaders(token),
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Logout failed');
        }
    }

    /**
     * Get customer profile
     */
    async getCustomerProfile(token: string): Promise<{ customer: MedusaCustomer }> {
        const response = await fetch(`${MEDUSA_BACKEND_URL}${API_ENDPOINTS.CUSTOMER_ME}`, {
            method: 'GET',
            headers: getHeaders(token),
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch customer profile');
        }

        return response.json();
    }

    /**
     * Update customer profile
     */
    async updateCustomerProfile(
        token: string,
        data: Partial<Omit<MedusaCustomer, 'id' | 'email'>>
    ): Promise<{ customer: MedusaCustomer }> {
        const response = await fetch(`${MEDUSA_BACKEND_URL}${API_ENDPOINTS.CUSTOMER_ME}`, {
            method: 'POST',
            headers: getHeaders(token),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        return response.json();
    }
}

export const authService = new AuthService();
