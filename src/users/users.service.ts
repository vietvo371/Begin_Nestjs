import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto): User {
    const user: User = {
      id: this.users.length + 1,
      ...createUserDto,
    };
    this.users.push(user);
    return user;
  }

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  update(id: number, updateUserDto: CreateUserDto): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updateUserDto,
      };
      return this.users[userIndex];
    }
    return null;
  }

  remove(id: number): User | null {
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex > -1) {
      const user = this.users[userIndex];
      this.users.splice(userIndex, 1);
      return user;
    }
    return null;
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  findByAge(age: number): User[] {
    return this.users.filter(user => user.age === age);
  }
}
