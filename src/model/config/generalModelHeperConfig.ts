import { userInformationType } from "./UserDataConfig"

export type isUserEmailExistReturnType = {
    isValid: boolean,
    userData: userInformationType
  }

export type loginTokenBodyType = {
    identifier: string,
    password: string
}
