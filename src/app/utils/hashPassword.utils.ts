import { HttpStatus } from '@nestjs/common';
import { ExceptionUtils } from './exception.utils';
import * as argon2 from 'argon2';

export async function hashPassword(password: string) {
  if (!password) {
    throw new ExceptionUtils('Password is required!', HttpStatus.BAD_REQUEST);
  }

  try {
    return await argon2.hash(password);
  } catch (error) {
    throw new Error('Hashing failed' + error);
  }
}
