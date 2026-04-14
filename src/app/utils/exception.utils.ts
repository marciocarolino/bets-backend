import { HttpException, HttpStatus } from '@nestjs/common';

export class ExceptionUtils extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
