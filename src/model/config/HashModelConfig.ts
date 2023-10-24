export type hashPasswordInputType = {
    plainTextPassword: string,
    saltFactor: number
}

export type comparePasswordInputType = {
    plainTextPassword: string,
    hashedPassword: string,
}