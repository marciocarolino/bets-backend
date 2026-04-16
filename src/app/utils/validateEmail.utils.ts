import { HttpStatus } from '@nestjs/common';
import { ExceptionUtils } from './exception.utils';

export function isEmailValid(email: string) {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  emailRegex.test(email);

  if (!emailRegex) {
    throw new ExceptionUtils('E-mail is mandatory!', HttpStatus.NOT_FOUND);
  }

  return true;
}
