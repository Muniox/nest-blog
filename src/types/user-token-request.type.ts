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
export enum UserAaccessTokenRequestData {
  userId = 'sub',
  email = 'email',
  username = 'username',
  issuedAt = 'iat',
  expirationAt = 'exp',
}

//TODO check if in refresh token data should be surname
// Refresh Token data
export enum UserRefreshTokenRequestData {
  userId = 'sub',
  email = 'email',
  username = 'username',
  issuedAt = 'iat',
  expirationAt = 'exp',
  refreshToken = 'refreshToken',
}
