import { constants } from 'http2';
import BaseHttpError from './base-error';

class ConflictError extends BaseHttpError {
  constructor(message: string) {
    super(message, constants.HTTP_STATUS_CONFLICT);
  }
}

export default ConflictError;
