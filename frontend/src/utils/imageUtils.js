/**
 * Helper to handle image URLs.
 * If the path starts with http, it returns it as is.
 * Otherwise, it prepends the API_URL.
 */
import { API_URL } from '../config/api';

export const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) {
        return path;
    }
    return `${API_URL}${path}`;
};
