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
import { SettingsService } from './shared/services/settings.service';
import { UserService } from '../user/shared/services/user.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@UseGuards(AuthGuard('jwt-access'))
@Controller('user/settings')
export class SettingsController {
  constructor(
    private settingsService: SettingsService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  public async getUserSettings(
    @GetUser('sub') userId: string,
  ): Promise<Settings> {
    const user = await this.userService.findOne({ id: userId });
    const settingsId = user.settingsId;

    return this.settingsService.findOne({ id: settingsId });
  }

  @HttpCode(HttpStatus.OK)
  @Put('/update')
  public async updateUserSettings(
    @GetUser('sub') userId: string,
    @Body() newSettings: UpdateSettingsDto,
  ): Promise<Settings> {
    const user = await this.userService.findOne({ id: userId });
    const settingsId = user.settingsId;

    return this.settingsService.updateSettings(settingsId, newSettings);
  }
}
