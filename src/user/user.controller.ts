import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUser } from './decorators/get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { OkResponse } from '../types/ok-response.type';
import { User } from './entities/user.entity';

/**
 * Search for documentation in postman
 * @ignore
 */
@Controller('user')
@UseGuards(AuthGuard('jwt-access'))
export class UserController {
  constructor(private userService: UserService) {}

  @Put('/password/update')
  @HttpCode(HttpStatus.OK)
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

  @Get('/current-user')
  @HttpCode(HttpStatus.OK)
  public async getUser(@GetUser('sub') userId: string): Promise<User> {
    const user = await this.userService.findOne({ id: userId });

    user.publicView();
    return user;
  }
}
