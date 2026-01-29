import axios from 'axios';
import { BRIDGE_API_URL } from './config';

const bridgeClient = axios.create({
    baseURL: BRIDGE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        // 'ngrok-skip-browser-warning': 'true',
    },
});

let bridgeAuthToken: string | null = null;
let bridgeCookieHeader: string | null = null;

const isServer = () => typeof window === 'undefined';

const extractCookieHeader = (setCookie: string | string[] | undefined) => {
    if (!setCookie) return null;
    const raw = Array.isArray(setCookie) ? setCookie : [setCookie];
    const pairs = raw
        .filter(Boolean)
        .map((c) => c.split(';')[0]?.trim())
        .filter(Boolean) as string[];
    return pairs.length ? pairs.join('; ') : null;
};

export const setBridgeAuthToken = (token?: string | null) => {
    bridgeAuthToken = token ?? null;

    if (bridgeAuthToken) {
        bridgeClient.defaults.headers.common.Authorization = `Bearer ${bridgeAuthToken}`;
    } else {
        delete bridgeClient.defaults.headers.common.Authorization;
    }
};

export const setBridgeCookieHeader = (cookieHeader?: string | null) => {
    bridgeCookieHeader = cookieHeader ?? null;

    if (!isServer()) return;

    if (bridgeCookieHeader) {
        bridgeClient.defaults.headers.common.Cookie = bridgeCookieHeader;
    } else {
        delete bridgeClient.defaults.headers.common.Cookie;
    }
};

bridgeClient.interceptors.request.use(
    (config) => {
        // Ensure withCredentials is true for all requests
        config.withCredentials = true;

        if (bridgeAuthToken && !config.headers?.Authorization) {
            config.headers.Authorization = `Bearer ${bridgeAuthToken}`;
        }

        // Search for Cookie presence in browser
        if (!isServer()) {
            console.log(`[Bridge Request] ${config.method?.toUpperCase()} ${config.url}`, {
                withCredentials: config.withCredentials,
                hasAuth: !!config.headers?.Authorization
            });
        }

        if (isServer() && bridgeCookieHeader && !config.headers?.Cookie) {
            config.headers.Cookie = bridgeCookieHeader;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

bridgeClient.interceptors.response.use(
    (response) => {
        if (isServer()) {
            const setCookie = response.headers?.['set-cookie'] as string | string[] | undefined;
            const cookieHeader = extractCookieHeader(setCookie);
            if (cookieHeader) {
                setBridgeCookieHeader(cookieHeader);
            }
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default bridgeClient;
