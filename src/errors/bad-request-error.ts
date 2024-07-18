import { constants } from 'http2';
import BaseHttpError from './base-error';

class BadRequestError extends BaseHttpError {
  constructor(message: string) {
    super(message, constants.HTTP_STATUS_BAD_REQUEST);
  }
}

export default BadRequestError;
