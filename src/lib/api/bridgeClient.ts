import axios from 'axios';
import { BRIDGE_API_URL } from './config';

const bridgeClient = axios.create({
    baseURL: BRIDGE_API_URL,
    headers: {
        "ngrok-skip-browser-warning": true,
        'Content-Type': 'application/json',
    },
});

// Add interceptors for auth tokens
bridgeClient.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const token = localStorage.getItem('hub_auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default bridgeClient;
