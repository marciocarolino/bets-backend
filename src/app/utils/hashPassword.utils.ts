import { HttpStatus } from "@nestjs/common";
import * as argon2 from "argon2";

import { ExceptionUtils } from "./exception.utils";

export async function HashPassword(password: string) {
  if (!password) {
    throw new ExceptionUtils("Password is required!", HttpStatus.BAD_REQUEST);
  }

  try {
    return await argon2.hash(password);
  } catch (error) {
    throw new Error("Hashing failed" + error);
  }
}
