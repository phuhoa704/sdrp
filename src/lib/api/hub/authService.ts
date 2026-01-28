import bridgeClient from '../bridgeClient';

export interface HubAuthResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role?: 'RETAILER' | 'SELLER' | 'ADMIN';
    avatar_url?: string;
    metadata?: Record<string, unknown>;
  };
  token: string;
}

export interface HubUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: 'RETAILER' | 'SELLER' | 'ADMIN';
  avatar_url?: string;
  metadata?: Record<string, unknown>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  first_name: string;
  last_name: string;
  role?: 'RETAILER' | 'SELLER' | 'ADMIN';
}

class HubAuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<HubAuthResponse> {
    try {
      const response = await bridgeClient.post<HubAuthResponse>('/auth/login', credentials);

      // Store token in localStorage and set it in axios headers
      if (response.data.token) {
        localStorage.setItem('hub_auth_token', response.data.token);
        bridgeClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<HubAuthResponse> {
    try {
      const response = await bridgeClient.post<HubAuthResponse>('/auth/register', data);

      // Store token in localStorage and set it in axios headers
      if (response.data.token) {
        localStorage.setItem('hub_auth_token', response.data.token);
        bridgeClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Get current session/user profile
   */
  async getSession(): Promise<{ user: HubUser }> {
    try {
      const token = localStorage.getItem('hub_auth_token');
      if (!token) {
        throw new Error('No token found');
      }

      // Set token in headers if not already set
      bridgeClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const response = await bridgeClient.get<{ user: HubUser }>('/auth/me');
      return response.data;
    } catch (error: any) {
      // Clear invalid token
      localStorage.removeItem('hub_auth_token');
      delete bridgeClient.defaults.headers.common['Authorization'];
      throw new Error('Session expired');
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    try {
      await bridgeClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local token and headers
      localStorage.removeItem('hub_auth_token');
      delete bridgeClient.defaults.headers.common['Authorization'];
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile(): Promise<{ user: HubUser }> {
    return this.getSession();
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    data: Partial<Omit<HubUser, 'id' | 'email'>>
  ): Promise<{ user: HubUser }> {
    try {
      const response = await bridgeClient.put<{ user: HubUser }>('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Initialize auth - restore token from localStorage
   */
  initializeAuth(): void {
    const token = localStorage.getItem('hub_auth_token');
    if (token) {
      bridgeClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
}

export const hubAuthService = new HubAuthService();
