export class ApiError extends Error {
    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.message = message;
        this.errors = errors;
    }
}
ApiError.UnauthorizedError = () => {
    return new ApiError(401, 'Пользователь не авторизован');
};
ApiError.BadRequest = (message, errors = []) => {
    return new ApiError(400, message, errors);
};
//# sourceMappingURL=api.exception.js.map