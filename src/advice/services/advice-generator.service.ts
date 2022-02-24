import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../../user/services/user.service';
import { Advice } from '../entities/advice.entity';
import { AdviceRepository } from '../repositories/advice.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { CategoryService } from '../../category/services/category.service';

/**
 * Cron service for generating advises
 */
@Injectable()
export class AdviceGeneratorService {
  /**
   * Inject providers
   * @param adviceRepository - to fetch advices
   * @param userService - to read user categories and history
   * @param notificationsService - to send notifications to the client
   * @param categoryService - to take brothers categories
   */
  constructor(
    @InjectRepository(AdviceRepository)
    private readonly adviceRepository: AdviceRepository,
    private readonly userService: UserService,
    private readonly notificationsService: NotificationsService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * Loop through all users
   * generate advices for them and send advices in notification
   */
  @Cron(CronExpression.EVERY_5_SECONDS)
  public async handleCrone() {
    const allUsers = await this.userService.findAll();

    const advicePromise = allUsers.map((user) => this.getAdvices(user.id));
    const usersAdvices = await Promise.all(advicePromise);

    const usersAdvicesMapped = allUsers.map((user, index) => ({
      userId: user.id,
      advices: usersAdvices[index],
    }));

    for (const obj of usersAdvicesMapped) {
      this.notificationsService.emit(obj.userId, {
        type: 'advices-generated',
        data: obj.advices,
      });
    }
  }

  /**
   * Finding all advices in category
   * and exclude some advices by array of ids
   * @param categoryId - category to search
   * @param excludedAdvices - array of ids that don't need to searching
   * @private
   */
  private findByCategory(
    categoryId: string,
    excludedAdvices: string[] = [],
  ): Promise<Advice[]> {
    let query = this.adviceRepository
      .createQueryBuilder('advice')
      .leftJoinAndSelect('advice.category', 'category')
      .where('category.id = :categoryId', { categoryId });
    if (excludedAdvices.length) {
      query = query.where('advice.id not in (:...excludedIds)', {
        excludedIds: excludedAdvices,
      });
    }

    return query.getMany();
  }

  /**
   * Finding all advices in category
   * and exclude some advices by array of ids
   * But if it can't find advices in passed category
   * Start searching in brothers categories
   *
   * @param categoryId - category to search
   * @param excludedAdvices - array of ids that don't need to searching
   * @private
   */
  private async complexCategory(
    categoryId: string,
    excludedAdvices: string[] = [],
  ): Promise<Advice[]> {
    const initialCategory = await this.findByCategory(
      categoryId,
      excludedAdvices,
    );
    if (initialCategory.length) {
      return initialCategory;
    }

    const brothers = await this.categoryService.brothers(categoryId);
    const brothersAdvicePromises = brothers.map((category) =>
      this.findByCategory(category.id, excludedAdvices),
    );
    const brothersAdvices = await Promise.all(brothersAdvicePromises);

    return brothersAdvices.flat();
  }

  /**
   * Search all user categories
   * and find for them advises without ones
   * that in user history
   * @param userId - id of user to search categories
   */
  public async getAdvices(userId: string): Promise<Advice[]> {
    const excludedAdvices = await this.userService.adviceHistory(userId);
    const excludedAdvicesIds = excludedAdvices.map((advice) => advice.id);
    const { subscribedCategories } = await this.userService.findWithCategories({
      id: userId,
    });

    const advicePromises = subscribedCategories.map((category) =>
      this.complexCategory(category.id, excludedAdvicesIds),
    );
    const advices = await Promise.all(advicePromises);
    return advices.flat();
  }
}
