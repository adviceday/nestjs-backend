import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UserService } from '../../user/services/user.service';
import { Advice } from '../entities/advice.entity';
import { AdviceRepository } from '../repositories/advice.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryService } from '../../category/services/category.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { AdviceService } from './advice.service';
import { Category } from '../../category/entities/category.entity';
import { FindManyOptions, In, Not } from 'typeorm';

/**
 * Cron service for generating advises
 */
@Injectable()
export class AdviceGeneratorService {
  /**
   * Inject providers
   * @param adviceRepository - to fetch advices
   * @param userService - to read user categories and history
   * @param adviceService - to set compilations
   * @param categoryService - to take brothers categories
   * @param notificationsService - to send notifications
   */
  constructor(
    @InjectRepository(AdviceRepository)
    private readonly adviceRepository: AdviceRepository,
    private readonly userService: UserService,
    private readonly adviceService: AdviceService,
    private readonly categoryService: CategoryService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Loop through all users
   * generate advices for them and send notification
   */
  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  public async handleCrone() {
    const allUsers = await this.userService.findAll();

    const advicePromise = allUsers.map(async (user) => {
      const compilation = await this.userService.getCompilation(user.id);
      if (!compilation.length) {
        return this.getAdvices(user.id);
      }
      return Promise.resolve([]);
    });
    const usersAdvices = await Promise.all(advicePromise);

    const usersAdvicesMapped = allUsers.map((user, index) => ({
      userId: user.id,
      advices: usersAdvices[index],
    }));

    for (const obj of usersAdvicesMapped) {
      if (obj.advices.length) {
        this.adviceService
          .clearUserCompilation(obj.userId)
          .then(() =>
            this.adviceService.setUserCompilation(
              obj.userId,
              obj.advices.map((advice) => advice.id),
            ),
          )
          .then(() =>
            this.notificationsService.emit(obj.userId, {
              en: 'New advices generated',
              ru: 'Новые советы сгенерированы',
            }),
          );
      }
    }
  }

  /**
   * Finding all advices in category
   * and exclude some advices by array of ids
   * @param categoryId - category to search
   * @param excludedAdvices - array of ids that don't need to searching
   * @private
   */
  private async findByCategory(
    categoryId: string,
    excludedAdvices: string[] = [],
  ): Promise<Advice[]> {
    const queryOptions: FindManyOptions<Advice> = {
      relations: ['category'],
      where: { category: { id: categoryId } },
    };

    if (excludedAdvices.length) {
      queryOptions.where['id'] = Not(In(excludedAdvices));
    }
    return this.adviceRepository.find(queryOptions);
  }

  /**
   * Fetch advices from brothers categories
   * @param categoryId - id of initial category
   * @param excludedIds - ids of advices that need to be ignored
   * @private
   */
  private async getBrotherAdvices(
    categoryId: string,
    excludedIds: string[],
  ): Promise<Advice[]> {
    const brothers = await this.categoryService.brothers(categoryId);
    const brothersAdvicePromises = brothers.map((category) =>
      this.findByCategory(category.id, excludedIds),
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
      this.findByCategory(category.id, excludedAdvicesIds),
    );
    const advicesMatrix = await Promise.all(advicePromises);
    const advices = advicesMatrix.flat();

    const emptyCategories: Category[] = advicesMatrix
      .map<Category | false>((arr, index) =>
        arr.length ? false : subscribedCategories[index],
      )
      .filter((category) =>
        category ? !!Object.keys(category).length : false,
      ) as Category[];

    const advicesIds = advices.map((advice) => advice.id);
    const brothersAdvicesPromises = emptyCategories.map((category) =>
      this.getBrotherAdvices(category.id, [
        ...excludedAdvicesIds,
        ...advicesIds,
      ]),
    );
    const brothersAdvicesMatrix = await Promise.all(brothersAdvicesPromises);
    const brothersAdvices = brothersAdvicesMatrix.flat();

    return [...brothersAdvices, ...advices];
  }
}
