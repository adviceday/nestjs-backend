import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services/user.service';
import { CategoryService } from '../../category/services/category.service';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { Category } from '../../category/entities/category.entity';
import { CompilationService } from './compilation.service';
import { Advice } from '../../advice/entities/advice.entity';
import { AdviceService } from '../../advice/services/advice.service';

/**
 * Cron service for generating advises
 */
@Injectable()
export class CompilationGeneratorService {
  /**
   * Inject providers
   * @param userService - to read user categories and history
   * @param categoryService - to take brothers categories
   * @param notificationsService - to send notifications
   * @param compilationService - to get ids of previous compilations
   * @param adviceService - to find advices by category
   */
  constructor(
    private readonly userService: UserService,
    private readonly categoryService: CategoryService,
    private readonly notificationsService: NotificationsService,
    private readonly compilationService: CompilationService,
    private readonly adviceService: AdviceService,
  ) {}

  /**
   * Loop through all users
   * generate advices for them and send notifications
   * @deprecated
   */
  // @Cron(CronExpression.EVERY_DAY_AT_NOON)
  public async handleCrone() {
    const allUsers = await this.userService.findAllIds();

    const advicePromise = allUsers.map((userId) => this.getAdvices(userId));
    const usersAdvices = await Promise.all(advicePromise);

    const usersAdvicesMapped = allUsers.map((userId, index) => ({
      userId,
      advices: usersAdvices[index],
    }));

    for (const obj of usersAdvicesMapped) {
      if (obj.advices.length) {
        this.compilationService
          .addCompilation(obj.userId, obj.advices)
          .then((compilation) =>
            this.notificationsService.emit(compilation.targetUser.id, {
              ru: 'Новые советы сгенерированы',
              en: 'New advices have been generated',
            }),
          );
      }
    }
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
      this.adviceService.findByCategory(category.id, excludedIds),
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
    let excludedAdvicesIds = await this.compilationService.getAllUserAdvicesIds(
      userId,
    );

    const { subscribedCategories } = await this.userService.findWithCategories({
      id: userId,
    });

    if (!subscribedCategories.length) return [];

    const adviceMatrix = [];
    await subscribedCategories.reduce(async (acc, category) => {
      const prevAdvices = await acc;
      adviceMatrix.push(prevAdvices);

      const prevAdvicesIds = prevAdvices.map((advice) => advice.id);
      excludedAdvicesIds = excludedAdvicesIds.concat(prevAdvicesIds);

      return this.adviceService.findByCategory(category.id, excludedAdvicesIds);
    }, this.adviceService.findByCategory(subscribedCategories[0].id, excludedAdvicesIds));

    const advices = adviceMatrix.flat();

    const emptyCategories: Category[] = adviceMatrix
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
