export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors = [],
  ) {
    super(message)
  }

  static BadRequest = (message: string, errors = []): ApiError => {
    return new ApiError(400, message, errors)
  }

  static UnauthorizedError = (): ApiError => {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static NotAccess = (message: string = 'Ошибка доступа') => {
    return new ApiError(403, message)
  }
}
