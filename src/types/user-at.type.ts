export type UserATRequest = {
  sub: string; //userId
  email: string; //userEmail
  iat: number;
  exp: number;
  refreshToken: string;
};
