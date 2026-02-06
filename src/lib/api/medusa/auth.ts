import bridgeClient, { setBridgeAuthToken } from '../bridgeClient';
import axios from 'axios';

export interface MedusaAuthResponse {
    customer: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        has_account: boolean;
        metadata?: Record<string, unknown>;
        vendor?: Vendor | null;
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
    vendor?: Vendor | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends LoginCredentials {
    first_name: string;
    last_name: string;
}

export type Vendor = {
    id: string;
    name: string;
    handle: string,
    logo: string | null,
    address: string,
    email: string,
    phone: string,
    tax_code: string | null,
    metadata: Record<string, unknown>,
    created_at: string,
    updated_at: string,
    deleted_at: string | null
}

type AdminMeResponse = {
    user: {
        id: string;
        email: string;
        first_name?: string;
        last_name?: string;
        metadata?: Record<string, unknown>;
        vendor?: Vendor;
    };
};

type StoreCustomerCreateResponse = { customer: MedusaCustomer };

type AuthLoginResponse = { token?: string };

const getErrorMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        const data = error.response?.data as { message?: string } | undefined;
        return data?.message || error.message || fallback;
    }
    if (error instanceof Error) {
        return error.message || fallback;
    }
    return fallback;
};

class AuthService {
    /**
     * Login with email and password using Medusa v2 Admin SDK
     */
    async login(credentials: LoginCredentials): Promise<MedusaAuthResponse> {
        try {
            // Medusa v2 Auth Login (Admin domain)
            const loginRes = await bridgeClient.post<AuthLoginResponse>('/auth/user/emailpass', credentials);

            // If explicit token is returned (typical for JWT mode), ensure it's set
            const token = loginRes.data?.token;
            if (token) {
                setBridgeAuthToken(token);
            }

            // Per Medusa session flow: calling /auth/session will return Set-Cookie.
            // Browser will store/send cookies automatically because `withCredentials: true`.
            await bridgeClient.post('/auth/session');

            // Retrieve admin user details after successful login
            const meRes = await bridgeClient.get<AdminMeResponse>('/admin/users/me', {
                params: {
                    fields: "*vendor"
                }
            });
            const user = meRes.data.user;

            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: user.metadata || {},
                    vendor: user.vendor || null
                },
                token: token
            };
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Invalid credentials'));
        }
    }

    /**
     * Register new customer (Using Store SDK)
     */
    async register(data: RegisterData): Promise<MedusaAuthResponse> {
        try {
            const res = await bridgeClient.post<StoreCustomerCreateResponse>('/store/customers', data);
            return { customer: res.data.customer };
        } catch (error: unknown) {
            throw new Error(getErrorMessage(error, 'Registration failed'));
        }
    }

    /**
     * Get current session (Admin Me)
     */
    async getSession(): Promise<{ customer: MedusaCustomer }> {
        try {
            const meRes = await bridgeClient.get<AdminMeResponse>('/admin/users/me', {
                params: {
                    fields: "*vendor"
                }
            });
            const user = meRes.data.user;
            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: user.metadata || {},
                    vendor: user.vendor || null
                }
            };
        } catch {
            throw new Error('Session expired');
        }
    }

    /**
     * Logout using Medusa v2 SDK
     */
    async logout(): Promise<void> {
        try {
            await bridgeClient.delete('/auth/session');
            setBridgeAuthToken(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    }

    /**
     * Get user profile
     */
    async getCustomerProfile(): Promise<{ customer: MedusaCustomer }> {
        try {
            const meRes = await bridgeClient.get<AdminMeResponse>('/admin/users/me', {
                params: {
                    fields: "*vendor"
                }
            });
            const user = meRes.data.user;
            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: user.metadata || {},
                    vendor: user.vendor || null
                }
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
            const meRes = await bridgeClient.get<AdminMeResponse>('/admin/users/me', {
                params: {
                    fields: "*vendor"
                }
            });
            const currentMe = meRes.data.user;

            const updateRes = await bridgeClient.post<AdminMeResponse>(`/admin/users/${currentMe.id}`, data);
            const user = updateRes.data.user;
            return {
                customer: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name || '',
                    last_name: user.last_name || '',
                    has_account: true,
                    metadata: user.metadata || {},
                    vendor: user.vendor || null
                }
            };
        } catch (error) {
            throw new Error('Failed to update profile');
        }
    }
}

export const authService = new AuthService();
