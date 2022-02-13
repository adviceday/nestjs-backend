import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RateRepository } from '../repositories/rate.repository';
import { Rate } from '../entities/rate.entity';
import { UserService } from '../../user/services/user.service';

/**
 * Rate service
 */
@Injectable()
export class RateService {
  /**
   * Inject providers
   * @param rateRepository - to manipulate rates table
   * @param userService - get access to operations with users
   */
  constructor(
    @InjectRepository(RateRepository)
    private rateRepository: RateRepository,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  /**
   * Take user id
   * and return his rate
   *
   * @param userId - id of user
   */
  public async getUserRate(userId: string): Promise<Rate> {
    const user = await this.userService.findOne({ id: userId });
    return this.findOne({ id: user.rateId });
  }

  /**
   * Finding rate
   *
   * @param rateFields - rate params
   */
  public async findOne(rateFields: Partial<Rate>): Promise<Rate | never> {
    const rate = await this.rateRepository.findOne(rateFields);
    if (!rate) {
      throw new NotFoundException('Searching rate is not exist');
    }

    return rate;
  }

  public getDefault(): Promise<Rate> {
    return this.findOne({ isDefault: true });
  }

  /**
   * Finding all rates in db
   */
  public getAll(): Promise<Rate[]> {
    return this.rateRepository.find();
  }
}
