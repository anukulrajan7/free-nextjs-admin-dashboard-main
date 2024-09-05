import { IncomingMessage } from 'http';
import cookie from 'cookie';

// Function to get a cookie value (works both client-side and server-side)
export const getCookie = (name: string, req?: IncomingMessage): string | undefined => {
    // If req is provided (server-side), get cookie from headers
    if (req) {
        const cookies = req.headers.cookie;
        const parsedCookies = cookies ? cookie.parse(cookies) : {};
        return parsedCookies[name] ? decodeURIComponent(parsedCookies[name]) : undefined;
    }

    // If no req, use document.cookie (client-side)
    if (typeof document !== 'undefined') {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop()!.split(';').shift()!);
        }
    }

    return undefined;
};
