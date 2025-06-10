import { Controller, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LogInInput } from '../dtos/requests/login/login.input';
import { CustomerSignUpInput } from '../dtos/requests/signup/customerSignup.input';
import { AuthTokenResponseOutput } from '../dtos/responses/auth-token-response.output';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtPayload } from 'src/auth/types/jwt-payload.type';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ManagerSignUpInput } from '../dtos/requests/signup/managerSignup.input';
import { ValidManagerPayload } from '../decorators/valid-auth-payload.decorator';
import { ResetPasswordInput } from '../dtos/requests/resetPassword/resetPassword.input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() credentials: LogInInput,
  ): Promise<{ data: AuthTokenResponseOutput }> {
    const token = await this.authService.login(credentials);
    return { data: { accessToken: token } };
  }

  @Post('customer/sign-up')
  async signUp(
    @Body() input: CustomerSignUpInput,
  ): Promise<{ data: AuthTokenResponseOutput }> {
    const token = await this.authService.registerCustomer(input);
    return { data: { accessToken: token } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('sign-out')
  async signOut(
    @CurrentUser() authPayload: JwtPayload,
  ): Promise<{ data: { signedOut: boolean } }> {
    await this.authService.logout(authPayload);
    return { data: { signedOut: true } };
  }

  @UseGuards(JwtAuthGuard)
  @Post('manager/sign-up')
  async managerSignUp(
    @CurrentUser() @ValidManagerPayload() authPayload: JwtPayload,
    @Body() input: ManagerSignUpInput,
  ): Promise<{ data: AuthTokenResponseOutput }> {
    const token = await this.authService.registerManager(input, authPayload);
    return { data: { accessToken: token } };
  }

  @Post('send-recover-email')
  async sendRecoverEmail(
    @Body('email') email: string,
  ): Promise<{ data: { codeSentTo: string } }> {
    await this.authService.sendRecoverEmail(email);
    return { data: { codeSentTo: email } };
  }

  @Patch('reset-password')
  async updatePassword(@Body() input: ResetPasswordInput) {
    await this.authService.updatePassword(input);
    return { message: 'Password updated successfully' };
  }
}
