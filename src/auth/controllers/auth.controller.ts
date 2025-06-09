import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LogInInput } from '../dtos/requests/login/login.input';
import { CustomerSignUpInput } from '../dtos/requests/signup/customerSignup.input';
import { AuthTokenResponseOutput } from '../dtos/responses/auth-token-response.output';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerSignUpInput } from '../dtos/requests/signup/managerSignup.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() credentials: LogInInput,
  ): Promise<AuthTokenResponseOutput> {
    const token = await this.authService.login(credentials);
    return { accessToken: token };
  }

  @Post('sign-up')
  async signUp(@Body() input: CustomerSignUpInput): Promise<AuthTokenResponseOutput> {
    const token = await this.authService.registerCustomer(input);
    return { accessToken: token };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async signOut(@CurrentUser() req: JwtPayload): Promise<{ message: string }> {
    await this.authService.logout(req.sub);
    return { message: 'Logged out succesfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-up/manager')
  async managerSignUp(@CurrentUser() credentials: JwtPayload, @Body() input: ManagerSignUpInput): Promise<AuthTokenResponseOutput> {
    const token = await this.authService.registerManager(input, credentials);
    return { accessToken: token };
  }

  @Post('send-recover-email')
  async sendRecoverEmail(@Body('email') email: string) {
    await this.authService.sendRecoverEmail(email);
    return {
      message: 'Email sent to user only if his registered email exists',
    };
  }

  @Patch('update-password')
  async updatePassword(@Body() data: { token: string; new_password: string }) {
    await this.authService.updatePassword(data.token, data.new_password);
    return { message: 'Password updated successfully' };
  }
}
