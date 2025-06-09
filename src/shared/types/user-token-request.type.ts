export type UserTokenRequest = {
  sub: string; //userId
  email: string; //userEmail
  username: string;
  iat: number;
  exp: number;
  refreshToken?: string;
};

// Access Token data
export enum UserAccessTokenRequestData {
  userId = 'sub',
  email = 'email',
  username = 'username',
  issuedAt = 'iat',
  expirationAt = 'exp',
}

// Refresh Token data
export enum UserRefreshTokenRequestData {
  userId = 'sub',
  email = 'email',
  username = 'username',
  issuedAt = 'iat',
  expirationAt = 'exp',
  refreshToken = 'refreshToken',
}
