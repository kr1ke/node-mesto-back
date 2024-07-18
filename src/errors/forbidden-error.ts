import { constants } from 'http2';
import BaseHttpError from './base-error';

class ForbiddenError extends BaseHttpError {
  constructor(message: string) {
    super(message, constants.HTTP_STATUS_FORBIDDEN);
  }
}

export default ForbiddenError;
