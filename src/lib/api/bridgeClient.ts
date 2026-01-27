import axios from 'axios';
import { BRIDGE_API_URL } from './config';

const bridgeClient = axios.create({
    baseURL: BRIDGE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptors if needed (e.g., for auth tokens)
bridgeClient.interceptors.request.use(
    (config) => {
        // You can get the token from local storage or state here
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default bridgeClient;
