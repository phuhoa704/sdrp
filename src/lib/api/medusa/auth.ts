import { medusa } from '../medusa';

export interface MedusaAuthResponse {
    customer: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        has_account: boolean;
        metadata?: Record<string, unknown>;
    };
    token?: string;
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
     * Login with email and password using Medusa v2 Admin SDK
     */
    async login(credentials: LoginCredentials): Promise<MedusaAuthResponse> {
        try {
            // Medusa v2 Auth Login (Admin domain)
            const response = await medusa.auth.login("user", "emailpass", credentials);

            // If explicit token is returned (typical for JWT mode), ensure it's set
            const token = (response as any).token;
            if (token) {
                (medusa as any).client?.setToken?.(token);
            }

            // Retrieve admin user details after successful login
            const { user } = await medusa.admin.user.me();

            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: (user as any).metadata || {}
                } as any,
                token: token
            };
        } catch (error: any) {
            throw new Error(error.message || 'Invalid credentials');
        }
    }

    /**
     * Register new customer (Using Store SDK)
     */
    async register(data: RegisterData): Promise<MedusaAuthResponse> {
        try {
            const { customer } = await medusa.store.customer.create(data);
            return { customer: customer as any };
        } catch (error: any) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    /**
     * Get current session (Admin Me)
     */
    async getSession(): Promise<{ customer: MedusaCustomer }> {
        try {
            const { user } = await medusa.admin.user.me();
            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: (user as any).metadata || {}
                } as any
            };
        } catch (error: any) {
            throw new Error('Session expired');
        }
    }

    /**
     * Logout using Medusa v2 SDK
     */
    async logout(): Promise<void> {
        try {
            await medusa.auth.logout();
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    /**
     * Get user profile
     */
    async getCustomerProfile(): Promise<{ customer: MedusaCustomer }> {
        try {
            const { user } = await medusa.admin.user.me();
            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: (user as any).metadata || {}
                } as any
            };
        } catch (error) {
            throw new Error('Failed to fetch user profile');
        }
    }

    /**
     * Update user profile
     */
    async updateCustomerProfile(
        data: Partial<Omit<MedusaCustomer, 'id' | 'email'>>
    ): Promise<{ customer: MedusaCustomer }> {
        try {
            // First get the user to obtain the ID
            const { user: currentMe } = await medusa.admin.user.me();
            const { user } = await medusa.admin.user.update(currentMe.id, data as any);
            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: (user as any).metadata || {}
                } as any
            };
        } catch (error) {
            throw new Error('Failed to update profile');
        }
    }
}

export const authService = new AuthService();
