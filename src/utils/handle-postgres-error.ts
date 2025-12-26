import { ApiMessages } from '@/constants/api-messages';
import { PostgresError } from 'postgres';
import ApiError from './api-error';

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const handlePostgresError = (error: PostgresError) => {
  switch (error.code) {
    case '23505': {
      const fieldMatch = error.detail?.match(/Key \((\w+)\)/);
      const field = fieldMatch ? fieldMatch[1] : 'Record';

      return ApiError.conflict(`${capitalize(field!)} already exists`);
    }

    case '23503': {
      return ApiError.badRequest('Related record not found');
    }

    case '23502': {
      const column = error.column_name || 'field';
      return ApiError.badRequest(`${capitalize(column)} is required`);
    }

    case '23514': {
      return ApiError.badRequest('Invalid data provided');
    }

    case '22001': {
      return ApiError.badRequest('Value too long for field');
    }

    case '22P02': {
      return ApiError.badRequest('Invalid input syntax');
    }

    case '23000': {
      return ApiError.badRequest('Integrity constraint violation');
    }

    case '08000':
    case '08003':
    case '08006': {
      return ApiError.internal('Database connection error');
    }

    case '40001': {
      return ApiError.conflict('Transaction conflict, please retry');
    }

    case '40P01': {
      return ApiError.conflict('Deadlock detected');
    }

    case '53000':
    case '53100':
    case '53200':
    case '53300':
    case '53400': {
      return ApiError.internal('Database resource limit exceeded');
    }

    case '42P01':
    case '42703':
    case '42501':
    case '42601':
    case '42846': {
      return ApiError.internal(ApiMessages.ERROR.DATABASE_ERROR);
    }

    default:
      return ApiError.internal(ApiMessages.ERROR.DATABASE_ERROR);
  }
};

export default handlePostgresError;
