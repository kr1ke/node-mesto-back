import { constants } from 'http2';
import BaseHttpError from './base-error';

class NotFoundError extends BaseHttpError {
  constructor(message: string) {
    super(message, constants.HTTP_STATUS_NOT_FOUND);
  }
}

export default NotFoundError;
