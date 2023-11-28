import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  async passHash(pass: string) {
    return await bcrypt.hash(pass, 10);
  }

  async checkPass(pass: string, hashed: string) {
    return await bcrypt.compare(pass, hashed);
  }
}
