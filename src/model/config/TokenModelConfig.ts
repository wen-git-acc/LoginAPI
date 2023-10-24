const jwtIssuerEmail = "fangwenjwt@xyz.com";
const jwtAudEmail = "frontend@xyz.com";

export type generateTokenInputType = {
    email: string;
    isAdmin: boolean;
};

export type jwtPayloadType = {
    _iss : typeof jwtIssuerEmail;
    _aud : typeof jwtAudEmail;
    _sub : string;
    _admin : boolean;
}

export type jwtFullPayloadType = jwtPayloadType & {exp:number,iat:number}

export type validTokenMessage = jwtFullPayloadType & {error:boolean, message:string};

export type tokenResponseType = {
    "accessToken": string;
    "message": string;
    "isAdmin": boolean;
    "isValid": boolean;
}