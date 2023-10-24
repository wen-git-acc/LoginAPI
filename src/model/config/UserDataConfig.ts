export const rolesEnum = ["user", "admin", "super_admin"] as const;

export type rolesType = typeof rolesEnum[number];
export type rolesArrType = typeof rolesEnum;

export type userInformationType = {
    userName: string,
    emailAddress: string,
    password:string,
    roles: {
        default: rolesType[],
    },
    other: {},
}

