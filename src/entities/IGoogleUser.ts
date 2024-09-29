export interface GoogleUser {
    id:string;
    iss?: string;
    nbf?: number;
    aud?: string;
    sub?: string;
    email: string;
    verified_email: boolean;
    azp?: string;
    name?: string;
    picture?: string;
    given_name: string;
    family_name?: string;
    iat?: number;
    exp?: number;
    jti?: string;
  }