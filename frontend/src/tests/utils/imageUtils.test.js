import { describe, it, expect, vi } from 'vitest';
import { getImageUrl } from '../../utils/imageUtils';

// Mock the config
vi.mock('../../config/api', () => ({
    API_URL: 'http://localhost:5000'
}));

describe('getImageUrl', () => {
    it('should return empty string if no path provided', () => {
        expect(getImageUrl(null)).toBe('');
        expect(getImageUrl(undefined)).toBe('');
    });

    it('should return original URL if it starts with http', () => {
        const url = 'https://example.com/image.jpg';
        expect(getImageUrl(url)).toBe(url);
    });

    it('should prepend API_URL if it is a local path', () => {
        const path = '/public/images/test.jpg';
        expect(getImageUrl(path)).toBe('http://localhost:5000/public/images/test.jpg');
    });
});
