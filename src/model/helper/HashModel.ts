import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { comparePasswordInputType, hashPasswordInputType } from '../config/HashModelConfig';

export function hashPassword({plainTextPassword, saltFactor}: hashPasswordInputType) : string {
    const salt = genSaltSync(saltFactor);
    return hashSync(plainTextPassword,salt);
}
 
export function comparePassword({plainTextPassword, hashedPassword}:comparePasswordInputType): boolean {
    return compareSync(plainTextPassword,hashedPassword);
}