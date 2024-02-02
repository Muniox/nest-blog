export type UserTokenRequest = {
  sub: string; //userId
  email: string; //userEmail
  surname: string;
  iat: number;
  exp: number;
  refreshToken?: string;
};

export enum UserATRequestData {
  sub = 'sub',
  email = 'email',
  iat = 'iat',
  exp = 'exp',
}

export enum UserRTRequestData {
  sub = 'sub',
  email = 'email',
  iat = 'iat',
  exp = 'exp',
  refreshToken = 'refreshToken',
}
