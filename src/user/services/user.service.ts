import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { hash } from 'bcrypt';
import { AddUserDto } from '../dto/add-user.dto';
import { User } from '../entities/user.entity';
import { IsNull, Not } from 'typeorm';
import { Settings } from '../../settings/entities/settings.entity';
import { RateService } from '../../rate/services/rate.service';
import { Advice } from '../../advice/entities/advice.entity';

/**
 * User service
 */
@Injectable()
export class UserService {
  /**
   * Inject providers
   *
   * @param userRepository - to manipulate users table
   * @param rateService - to get rate
   */
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @Inject(forwardRef(() => RateService))
    private rateService: RateService,
  ) {}

  /**
   * Add user to database
   * also hash his password
   *
   * @param userDto - user credentials with authMethod
   */
  public async addUser(userDto: AddUserDto): Promise<User> {
    const exist = await this.userRepository.findOne({ email: userDto.email });
    if (exist) {
      throw new ConflictException('User with this email already exits');
    }

    const user = new User();
    user.email = userDto.email;
    user.authMethod = userDto.authMethod;
    user.hashedPassword = await UserService.hashData(userDto.password);

    const settings = new Settings();
    settings.lang = 'ru';

    user.settings = settings;
    user.rate = await this.rateService.getDefault();

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
    const compareRes = await user.validatePassword(oldPassword);

    if (!compareRes) {
      throw new BadRequestException('Field oldPassword is incorrect');
    }
    user.hashedPassword = await UserService.hashData(newPassword);

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
    user.hashedRefreshToken = await UserService.hashData(refreshToken);

    return user.save();
  }

  /**
   * Finding user
   *
   * @param userFields - user params
   */
  public async findOne(userFields: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne(userFields);
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return user;
  }

  /**
   * Fetch all users' ids from db
   */
  public async findAllIds(): Promise<string[]> {
    const users = await this.userRepository.find({ select: ['id'] });
    return users.map((user) => user.id);
  }

  /**
   * Finding user and all subscribed categories
   *
   * @param userFields - user params
   */
  public async findWithCategories(userFields: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: userFields,
      relations: ['subscribedCategories'],
    });
    if (!user) {
      throw new NotFoundException('User is not found');
    }

    return user;
  }

  /**
   * Returns user favorite advices
   * @param userId - id of selected user
   */
  public async getFavorites(userId: string): Promise<Advice[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['favoriteAdvices'],
    });

    return user.favoriteAdvices;
  }

  /**
   * TODO move to advice service
   * Returns user history
   * @param userId - id of selected user
   */
  public async adviceHistory(userId: string): Promise<Advice[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['adviceHistory'],
    });

    return user.adviceHistory;
  }

  /**
   * TODO move to advice service
   * Returns current advice compilation
   * for selected user
   * @param userId - id of selected user
   */
  public async getCompilation(userId: string): Promise<Advice[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['adviceCompilation'],
    });

    return user.adviceCompilation;
  }

  /**
   * add many-to-many relation record of user entity
   * If relation already exist just return user
   * @param userId - id of user to add relation
   * @param relationKey - field which contain relation
   * @param relationId - id of related object or array of them
   */
  public async addManyToMany(
    userId: string,
    relationKey: keyof User,
    relationId: string | string[],
  ): Promise<User> {
    const user = await this.findOne({ id: userId });
    const relations = await this.userRepository
      .createQueryBuilder()
      .relation(User, relationKey)
      .of(user)
      .loadMany();

    const relationIds = relations.map((rel) => rel.id);
    if (relationIds.includes(relationId)) {
      return user;
    }

    await this.userRepository
      .createQueryBuilder()
      .relation(User, relationKey)
      .of(user)
      .add(relationId);

    return user;
  }

  /**
   * remove many-to-many relation record of user entity
   * @param userId - id of user to add relation
   * @param relationKey - field which contain relation
   * @param relationId - id of related object or array of them
   */
  public async removeManyToMany(
    userId: string,
    relationKey: keyof User,
    relationId: string | string[],
  ): Promise<User> {
    const user = await this.findOne({ id: userId });
    await this.userRepository
      .createQueryBuilder()
      .relation(User, relationKey)
      .of(user)
      .remove(relationId);

    return user;
  }

  /**
   * generate hash of passed data and return this hash
   * @param data - data that need to be hashed
   * @private
   */
  private static hashData(data: string): Promise<string> {
    return hash(data, 10);
  }
}
