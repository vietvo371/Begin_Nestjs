import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Role } from './enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user || undefined;
  }

  async register(username: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      username,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async getProfile(id: number): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private generateToken(user: User): string {
    return jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  }

  async login(username: string, password: string): Promise<{ id: number; username: string; role: Role; token: string }> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
    }
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      token: this.generateToken(user),
    };
  }
}
