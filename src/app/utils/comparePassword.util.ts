import * as argon2 from 'argon2';

export async function comparePassword(
    plainPassword: string,
    hashedPassword: string
):Promise<boolean>{
    return argon2.verify(hashedPassword, plainPassword);
}