import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdviceAuthorRepository } from '../repositories/advice-author.repository';
import { AdviceAuthor } from '../entities/advice-author.entity';

/**
 * Advice's author service
 */
@Injectable()
export class AdviceAuthorService {
  /**
   * Inject providers
   * @param authorRepository - to manipulate author
   */
  constructor(
    @InjectRepository(AdviceAuthorRepository)
    private readonly authorRepository: AdviceAuthorRepository,
  ) {}

  /**
   * Finding author
   * @param authorFields - author params
   */
  public async findOne(
    authorFields: Partial<AdviceAuthor>,
  ): Promise<AdviceAuthor> {
    const author = await this.authorRepository.findOne(authorFields);
    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  /**
   * Get all authors in db
   */
  public getAll(): Promise<AdviceAuthor[]> {
    return this.authorRepository.find();
  }
}
