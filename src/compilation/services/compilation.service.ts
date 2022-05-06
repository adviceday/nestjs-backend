import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompilationRepository } from '../repositories/compilation.repository';
import { Advice } from '../../advice/entities/advice.entity';
import { Compilation } from '../entities/compilation.entity';
import { UserService } from '../../user/services/user.service';
import * as dayjs from 'dayjs';
import { Between } from 'typeorm';

/**
 * Compilation service for CRUD
 */
@Injectable()
export class CompilationService {
  /**
   * Inject providers
   * @param compilationRepository - to manipulate compilations
   * @param userService - to fetch user
   */
  constructor(
    @InjectRepository(CompilationRepository)
    private readonly compilationRepository: CompilationRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Create compilation in db
   * @param userId - owner of compilation
   * @param advices - compilation content
   */
  public async addCompilation(
    userId: string,
    advices: Advice[],
  ): Promise<Compilation> {
    const compilation = new Compilation();
    compilation.advices = advices;
    compilation.targetUser = await this.userService.findOne({ id: userId });

    return compilation.save();
  }

  /**
   * Return all advices ids of all compilations
   * @param userId - owner of compilations
   */
  public async getAllUserAdvicesIds(userId: string): Promise<string[]> {
    const query = this.compilationRepository
      .createQueryBuilder('com')
      .leftJoinAndSelect('com.advices', 'adv')
      .select(['adv.id', 'com.id'])
      .where('com.targetUser = :userId', { userId });
    const compilations = await query.getMany();

    return compilations.map((com) => com.advices.map((adv) => adv.id)).flat();
  }

  /**
   * Return compilation for today if it's exist
   * @param userId - id of user that requests compilation
   */
  public getToday(userId: string): Promise<Compilation | undefined> {
    const todayStart = dayjs().format('YYYY-MM-DD');
    const todayEnd = dayjs().format();

    return this.compilationRepository.findOne({
      relations: ['targetUser', 'advices'],
      where: {
        targetUser: userId,
        createdAt: Between(todayStart, todayEnd),
      },
    });
  }

  /**
   * Mark specific compilation as fetched
   * @param compilationId - ID of compilation
   */
  public async markFetched(compilationId: string): Promise<string> {
    const fetchedAt = dayjs().format();
    await this.compilationRepository.update(
      { id: compilationId },
      { firstFetchedAt: fetchedAt },
    );

    return fetchedAt;
  }

  /**
   * Find all compilation generated for user
   *
   * @param userId - ID of user
   */
  public findAll(userId: string): Promise<Compilation[]> {
    return this.compilationRepository.find({ where: { targetUser: userId } });
  }

  /**
   * Try to find compilation record
   * if it's not exist throws error
   *
   * @param compilationFields - fields to search in table
   */
  public async findOne(
    compilationFields: Partial<Compilation>,
  ): Promise<Compilation> {
    const user = await this.compilationRepository.findOne({
      where: compilationFields,
      relations: ['targetUser', 'advices'],
    });
    if (!user) {
      throw new NotFoundException('Compilation is not found');
    }

    return user;
  }
}
