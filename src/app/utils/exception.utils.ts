import { ConflictException, HttpException, HttpStatus } from "@nestjs/common";

export class ExceptionUtils extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(
      {
        message,
        success: false,
      },
      status,
    );
  }
}

export class ApplicationException extends Error {}

export class SagaContextDuplicateException extends ApplicationException {
  constructor(message: string) {
    super(message);
    this.name = "SagaContextDuplicateException";
  }

  toHttpException(): ConflictException {
    return new ConflictException({ message: this.message, success: false });
  }
}
