// Crear un sistema centralizado de manejo de errores
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  SERVER = 'SERVER_ERROR',
  NETWORK = 'NETWORK_ERROR',
}

export interface ApiErrorResponse {
  message: string;
  type: ErrorType;
  errors?: Record<string, string[]>;
  stack?: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public type: ErrorType,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toResponse(): ApiErrorResponse {
    return {
      message: this.message,
      type: this.type,
      errors: this.errors,
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack }),
    };
  }
}

export const handleApiError = (error: unknown): ApiErrorResponse => {
  if (error instanceof ApiError) {
    return error.toResponse();
  }

  if (error instanceof Error) {
    return {
      message: 'Ha ocurrido un error inesperado',
      type: ErrorType.SERVER,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    };
  }

  return {
    message: 'Ha ocurrido un error desconocido',
    type: ErrorType.SERVER,
  };
};

export const createApiError = {
  validation: (message: string, errors?: Record<string, string[]>) =>
    new ApiError(400, message, ErrorType.VALIDATION, errors),

  authentication: (message = 'No autenticado') =>
    new ApiError(401, message, ErrorType.AUTHENTICATION),

  authorization: (message = 'No autorizado') => new ApiError(403, message, ErrorType.AUTHORIZATION),

  notFound: (message = 'Recurso no encontrado') => new ApiError(404, message, ErrorType.NOT_FOUND),

  server: (message = 'Error interno del servidor') => new ApiError(500, message, ErrorType.SERVER),
};
