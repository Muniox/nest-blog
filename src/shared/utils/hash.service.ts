import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  async hashData(data: string | Buffer): Promise<string> {
    return await argon2.hash(data);
  }

  async compareData(data: string | Buffer, hash: string): Promise<boolean> {
    return await argon2.verify(hash, data);
  }
}
