import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dtos/auth.dto';
import { ConflictError, UnauthorizedError } from '../errors';
import { signToken } from '../utils/jwt';

const SALT_ROUNDS = 10;

export class AuthService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  /**
   * Registers a new user with a self-selected role.
   * @param data - The registration payload (name, email, password, role).
   * @returns The created user's public data plus a signed JWT.
   * @throws {ConflictError} If a user with the same email already exists.
   */
  public async register(data: RegisterDto): Promise<AuthResponseDto> {
    await this.ensureEmailIsNotTaken(data.email);

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await this.userRepository.create({ ...data, password: hashedPassword });

    const token = signToken({ id: user.id, role: user.role });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  /**
   * Authenticates a user with email and password.
   * @param data - The login payload (email, password).
   * @returns The authenticated user's public data plus a signed JWT.
   * @throws {UnauthorizedError} If the credentials are invalid.
   */
  public async login(data: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = signToken({ id: user.id, role: user.role });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  private async ensureEmailIsNotTaken(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictError(`A user with email "${email}" already exists`);
    }
  }
}
