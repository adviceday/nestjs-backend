import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/decorators/get-user.decorator';
import { Settings } from './entities/settings.entity';
import { SettingsService } from './services/settings.service';
import { UserService } from '../user/services/user.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

/**
 * Search for documentation in postman
 * @ignore
 */
@Controller('user/settings')
@UseGuards(AuthGuard('jwt-access'))
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  public async getUserSettings(
    @GetUser('sub') userId: string,
  ): Promise<Settings> {
    const user = await this.userService.findOne({ id: userId });
    const settingsId = user.settingsId;

    return this.settingsService.findOne({ id: settingsId });
  }

  @Put('/update')
  @HttpCode(HttpStatus.OK)
  public async updateUserSettings(
    @GetUser('sub') userId: string,
    @Body() newSettings: UpdateSettingsDto,
  ): Promise<Settings> {
    const user = await this.userService.findOne({ id: userId });
    const settingsId = user.settingsId;

    return this.settingsService.updateSettings(settingsId, newSettings);
  }
}
