import { User } from '../models';
import { RegisterDto } from '../dtos/auth.dto';

export class UserRepository {
  public async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  public async create(data: RegisterDto & { password: string }): Promise<User> {
    return User.create(data);
  }
}
