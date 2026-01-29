import axios from 'axios';
import { BRIDGE_API_URL, MEDUSA_PUBLISHABLE_KEY } from './config';

const bridgeClient = axios.create({
    baseURL: BRIDGE_API_URL,
    withCredentials: true,
    headers: {
        "ngrok-skip-browser-warning": true,
        'Content-Type': 'application/json',
    },
});

let bridgeAuthToken: string | null = null;

export const setBridgeAuthToken = (token?: string | null) => {
    bridgeAuthToken = token ?? null;

    if (bridgeAuthToken) {
        bridgeClient.defaults.headers.common.Authorization = `Bearer ${bridgeAuthToken}`;
    } else {
        delete bridgeClient.defaults.headers.common.Authorization;
    }
};

bridgeClient.interceptors.request.use(
    (config) => {
        if (bridgeAuthToken && !config.headers?.Authorization) {
            config.headers.Authorization = `Bearer ${bridgeAuthToken}`;
            config.headers["Access-Control-Allow-Origin"] = "*";
        }

        if (MEDUSA_PUBLISHABLE_KEY && !config.headers?.['x-publishable-api-key']) {
            config.headers['x-publishable-api-key'] = MEDUSA_PUBLISHABLE_KEY;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default bridgeClient;
