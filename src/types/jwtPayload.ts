export type JwtPayload = {
  sub: string;
  email: string;
  username: string;
};

export type JwtReturnPayload = {
  sub: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
};

export type JwtAccessToken = JwtReturnPayload;

export type JwtRefreshToken = {
  sub: string;
  email: string;
  username: string;
  iat: number;
  exp: number;
  refreshToken: string;
};
