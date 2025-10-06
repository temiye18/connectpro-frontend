import { AxiosError } from 'axios';

/**
 * API Error Response from backend
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * Type guard to check if error is an Axios error
 */
export function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Extract error message from various error types
 * @param error - Error from try-catch or mutation
 * @param fallback - Fallback message if error message cannot be extracted
 */
export function getErrorMessage(error: unknown, fallback: string = 'An error occurred'): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === 'string') {
    return error;
  }

  return fallback;
}

/**
 * Extract validation errors from API response
 */
export function getValidationErrors(error: unknown): Array<{ field: string; message: string }> | null {
  if (isAxiosError(error)) {
    return error.response?.data?.errors || null;
  }
  return null;
}
