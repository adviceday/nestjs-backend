import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './shared/services/user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUser } from './decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { OkResponse } from '../types/ok-response.type';

/**
 * Search for documentation in postman
 * @ignore
 */
@UseGuards(AuthGuard('jwt-access'))
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Put('/password/update')
  public async updatePassword(
    @Body() body: UpdatePasswordDto,
    @GetUser('sub') userId: string,
  ): Promise<OkResponse> {
    await this.userService.updatePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );

    return { message: 'ok' };
  }
}
