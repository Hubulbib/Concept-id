export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public errors = [],
  ) {
    super(message)
  }

  static UnauthorizedError = (): ApiError => {
    return new ApiError(401, 'Пользователь не авторизован')
  }

  static BadRequest = (message: string, errors = []): ApiError => {
    return new ApiError(400, message, errors)
  }
}
