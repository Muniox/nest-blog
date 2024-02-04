import * as argon2 from 'argon2';

export const hashData = async (data: string | Buffer): Promise<string> => {
  return argon2.hash(data);
};
