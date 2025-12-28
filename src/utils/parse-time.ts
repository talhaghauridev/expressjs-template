import ms from 'ms';
import ApiError from './api-error';

export const parseTimeToMs = (time: string): number => {
  // @ts-ignore
  const milliseconds = ms(time);
  if (!milliseconds) {
    throw ApiError.badRequest(`Invalid time format: ${time}`);
  }
  return milliseconds;
};
