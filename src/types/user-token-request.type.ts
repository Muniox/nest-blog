export type UserTokenRequest = {
  sub: string; //userId
  email: string; //userEmail
  username: string;
  iat: number;
  exp: number;
  refreshToken?: string;
};

//TODO check if in access token data should be surname
// Access Token data
export enum UserATRequestData {
  sub = 'sub',
  email = 'email',
  username = 'username',
  iat = 'iat',
  exp = 'exp',
}

//TODO check if in refresh token data should be surname
// Refresh Token data
export enum UserRTRequestData {
  sub = 'sub',
  email = 'email',
  iat = 'iat',
  exp = 'exp',
  refreshToken = 'refreshToken',
}
