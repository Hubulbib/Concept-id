import { ApiError } from '../../exceptions/api.exception.js';
export const ErrorMiddleware = (err, req, res) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: 'Непредвиденная ошибка' });
};
//# sourceMappingURL=error.middleware.js.map