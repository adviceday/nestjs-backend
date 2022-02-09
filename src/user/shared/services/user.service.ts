import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { hash } from 'bcrypt';
import { AddUserDto } from '../../dto/add-user.dto';
import { User } from '../../entities/user.entity';
import { IsNull, Not } from 'typeorm';

@Injectable()
/**
 * User service
 */
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  /**
   * Add user to database
   * also hash his password
   *
   * @param userDto - user credentials with authMethod
   */
  public async addUser(userDto: AddUserDto): Promise<User> {
    const exist = await this.findOne({ email: userDto.email });
    if (exist) {
      throw new ConflictException('User with this email already exits');
    }

    const user = new User();
    user.email = userDto.email;
    user.authMethod = userDto.authMethod;
    user.hashedPassword = await this.hashData(userDto.password);

    return user.save();
  }

  /**
   * Update password of selected user
   * checks if old password is correct
   *
   * @param userId - id of user which update
   * @param oldPassword - old password of updated user
   * @param newPassword - new password for updated user
   */
  public async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const compareRes = await user.validatePassword(oldPassword);

    if (!compareRes) {
      throw new BadRequestException('Field oldPassword is incorrect');
    }
    user.hashedPassword = await this.hashData(newPassword);

    return user.save();
  }

  /**
   * Finding user and
   * set his refresh token to in record null
   *
   * @param userId - id of user
   */
  public async removeRefreshToken(userId: string): Promise<User> {
    const [user] = await this.userRepository.find({
      id: userId,
      hashedRefreshToken: Not(IsNull()),
    });

    if (!user) {
      return;
    }

    user.hashedRefreshToken = null;
    return user.save();
  }

  /**
   * takes user and new refresh token,
   * hash it and save into database
   *
   * @param userId - id of user which need to update token
   * @param refreshToken - new refresh token
   */
  public async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ id: userId });
    user.hashedRefreshToken = await this.hashData(refreshToken);

    return user.save();
  }

  /**
   * Finding user
   *
   * @param user - user params
   */
  public findOne(user: Partial<User>): Promise<User> {
    return this.userRepository.findOne(user);
  }

  /**
   * generate hash of passed data and return this hash
   * @param data - data that need to be hashed
   * @private
   */
  private hashData(data: string): Promise<string> {
    return hash(data, 10);
  }
}
