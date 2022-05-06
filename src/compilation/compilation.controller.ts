import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CompilationService } from './services/compilation.service';
import { CompilationGeneratorService } from './services/compilation-generator.service';
import { GetUser } from '../user/decorators/get-user.decorator';
import { Compilation } from './entities/compilation.entity';

/**
 * @ignore
 */
@Controller('compilation')
@UseGuards(AuthGuard('jwt-access'))
export class CompilationController {
  constructor(
    private readonly compilationService: CompilationService,
    private readonly compilationGeneratorService: CompilationGeneratorService,
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  public getAllCompilations(
    @GetUser('sub') userId: string,
  ): Promise<Compilation[]> {
    return this.compilationService.findAll(userId);
  }

  @Get('today')
  @HttpCode(HttpStatus.OK)
  public async getToday(@GetUser('sub') userId: string): Promise<Compilation> {
    const compilation = await this.compilationService.getToday(userId);
    if (!compilation) {
      throw new NotFoundException('No compilation found for today');
    }

    if (!compilation.firstFetchedAt) {
      compilation.firstFetchedAt = await this.compilationService.markFetched(
        compilation.id,
      );
    }

    compilation.targetUser = undefined;
    return compilation;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getCompilation(
    @Param('id', ParseUUIDPipe) compilationId: string,
    @GetUser('sub') userId: string,
  ): Promise<Compilation> {
    const compilation = await this.compilationService.findOne({
      id: compilationId,
    });

    if (compilation.targetUser.id !== userId) {
      throw new NotFoundException('Compilation is not found');
    }

    if (!compilation.firstFetchedAt) {
      compilation.firstFetchedAt = await this.compilationService.markFetched(
        compilationId,
      );
    }
    compilation.targetUser = undefined;

    return compilation;
  }

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  public async triggerGeneration(
    @GetUser('sub') userId: string,
  ): Promise<Compilation> {
    const todayCompilation = await this.compilationService.getToday(userId);
    if (todayCompilation) {
      throw new BadRequestException(
        'Compilation for this day is already exist',
      );
    }

    const advices = await this.compilationGeneratorService.getAdvices(userId);
    const compilation = await this.compilationService.addCompilation(
      userId,
      advices,
    );
    if (!compilation.firstFetchedAt) {
      compilation.firstFetchedAt = await this.compilationService.markFetched(
        compilation.id,
      );
    }
    compilation.targetUser = undefined;

    return compilation;
  }
}
