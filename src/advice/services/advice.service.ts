import { Injectable, NotFoundException } from '@nestjs/common';
import { AdviceRepository } from '../repositories/advice.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../../user/services/user.service';
import { Advice } from '../entities/advice.entity';

/**
 * Advice service
 */
@Injectable()
export class AdviceService {
  /**
   * Inject providers
   * @param adviceRepository - to manipulate advice table
   * @param userService - to manage many-to-many relations
   */
  constructor(
    @InjectRepository(AdviceRepository)
    private readonly adviceRepository: AdviceRepository,
    private readonly userService: UserService,
  ) {}

  /**
   * Returns user favorite advices
   * @param userId - id of selected user
   */
  public getFavorites(userId: string): Promise<Advice[]> {
    return this.adviceRepository.query(
      `
          select *
          from main.public.advice
                   inner join main.public.user_favorite_advices ufa on advice.id = ufa."adviceId"
          where ufa."userId" = $1
      `,
      [userId],
    );
  }

  /**
   * Add advice to user's favorites
   * @param adviceId - ID of advice that need to be added
   * @param userId - ID of user that want to add advice
   */
  public async addToFavorites(
    adviceId: string,
    userId: string,
  ): Promise<Advice> {
    const advice = await this.findOne({ id: adviceId });
    await this.userService.addManyToMany(userId, 'favoriteAdvices', adviceId);

    return advice;
  }

  /**
   * Remove advice from user's favorites
   * @param adviceId - ID of advice that need to be removed
   * @param userId - ID of user that want to remove advice
   */
  public async removeFromFavorites(
    adviceId: string,
    userId: string,
  ): Promise<Advice> {
    const advice = await this.findOne({ id: adviceId });
    await this.userService.removeManyToMany(
      userId,
      'favoriteAdvices',
      adviceId,
    );

    return advice;
  }

  /**
   * Returns user history
   * @param userId - id of selected user
   */
  public getHistory(userId: string): Promise<Advice[]> {
    return this.adviceRepository.query(
      `
          select *
          from main.public.advice
                   inner join main.public.user_advice_history ufa on advice.id = ufa."adviceId"
          where ufa."userId" = $1
      `,
      [userId],
    );
  }

  /**
   * Add advice to user's history
   * @param adviceId - ID of advice that need to be added
   * @param userId - ID of user that want to add advice
   */
  public async addToHistory(adviceId: string, userId: string): Promise<Advice> {
    const advice = await this.findOne({ id: adviceId });
    await this.userService.addManyToMany(userId, 'adviceHistory', advice.id);

    return advice;
  }

  /**
   * Remove advice from user's history
   * @param adviceId - ID of advice that need to be removed
   * @param userId - ID of user that want to remove advice
   */
  public async removeFromHistory(
    adviceId: string,
    userId: string,
  ): Promise<Advice> {
    const advice = await this.findOne({ id: adviceId });
    await this.userService.removeManyToMany(userId, 'adviceHistory', adviceId);

    return advice;
  }

  /**
   * Finding all advices in category
   * and exclude some advices by array of ids
   * @param categoryId - category to search
   * @param excludedAdvices - array of ids that don't need to searching
   */
  public async findByCategory(
    categoryId: string,
    excludedAdvices: string[] = [],
  ): Promise<Advice[]> {
    let query = this.adviceRepository
      .createQueryBuilder('advice')
      .innerJoinAndSelect(
        'advice.categories',
        'category',
        'category.id = :categoryId',
        { categoryId },
      );
    if (excludedAdvices.length) {
      query = query.where('advice.id not in (:...excludedAdvices)', {
        excludedAdvices,
      });
    }
    return query.getMany();
  }

  /**
   * Try to find advice record
   * if it's not exist throws error
   *
   * @param adviceFields - fields to search in table
   */
  public async findOne(adviceFields: Partial<Advice>): Promise<Advice> {
    const advice = this.adviceRepository.findOne(adviceFields);
    if (!adviceFields) {
      throw new NotFoundException('Advice is not found');
    }

    return advice;
  }
}
