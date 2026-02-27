const AppError = require('../../utils/appError');
const catchAsync = require('../../utils/catchAsync');

describe('AppError Utility', () => {
    test('should create an error with correct message and statusCode', () => {
        const error = new AppError('Test error', 400);
        expect(error.message).toBe('Test error');
        expect(error.statusCode).toBe(400);
        expect(error.status).toBe('fail');
        expect(error.isOperational).toBe(true);
    });

    test('should set status to "error" for 5xx status codes', () => {
        const error = new AppError('Server error', 500);
        expect(error.status).toBe('error');
    });

    test('should capture stack trace', () => {
        const error = new AppError('Stack trace test', 400);
        expect(error.stack).toBeDefined();
    });
});

describe('catchAsync Utility', () => {
    test('should call the function and catch errors', async () => {
        const next = jest.fn();
        const mockFn = jest.fn().mockRejectedValue(new Error('Async error'));

        const caught = catchAsync(mockFn);
        await caught({}, {}, next);

        expect(mockFn).toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    test('should resolve correctly when no error is thrown', async () => {
        const next = jest.fn();
        const mockFn = jest.fn().mockResolvedValue('success');

        const caught = catchAsync(mockFn);
        await caught({}, {}, next);

        expect(mockFn).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
});
