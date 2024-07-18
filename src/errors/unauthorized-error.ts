import { constants } from 'http2';
import BaseHttpError from './base-error';

class UnauthorizedError extends BaseHttpError {
  constructor(message: string) {
    super(message, constants.HTTP_STATUS_UNAUTHORIZED);
  }
}

export default UnauthorizedError;
