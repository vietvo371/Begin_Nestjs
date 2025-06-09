import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(username: string, password: string) {
        try {
            // Kiểm tra user đã tồn tại chưa
            const existingUser = await this.usersService.findByUsername(username);
            if (existingUser) {
                throw new ConflictException(`Username ${username} already exists`);
            }

            // Tạo user mới
            const user = await this.usersService.register(username, password);
            
            // Trả về token
            const payload = { username: user.username, sub: user.id };
            return {
                message: 'Registration successful',
                username: user.username,
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Error during registration');
        }
    }

    async login(username: string, password: string) {
        try {
            // Tìm user
            const user = await this.usersService.findByUsername(username);
            if (!user) {
                throw new UnauthorizedException('Invalid username or password');
            }

            // Kiểm tra password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid username or password');
            }

            // Tạo JWT token
            const payload = { username: user.username, sub: user.id };
            return {
                message: 'Login successful',
                username: user.username,
                access_token: this.jwtService.sign(payload),
            };
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException('Error during login');
        }
    }

    async validateUser(username: string, pass: string): Promise<any> {
        try {
            const user = await this.usersService.findByUsername(username);
            if (user && await bcrypt.compare(pass, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            return null;
        } catch (error) {
            throw new InternalServerErrorException('Error validating user');
        }
    }
}