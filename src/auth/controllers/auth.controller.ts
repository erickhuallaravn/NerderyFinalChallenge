import {
  Controller,
  Request,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LogInInput } from '../dtos/requests/login/login.input';
import { SignUpInput } from '../dtos/requests/signup/signup.input';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { AuthTokenResponseOutput } from '../dtos/responses/auth-token-response.output';

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
  async signUp(@Body() input: SignUpInput): Promise<AuthTokenResponseOutput> {
    const token = await this.authService.registerCustomer(input);
    return { accessToken: token };
  }

  @UseGuards(GqlAuthGuard)
  @Post('sign-out')
  async signOut(@Request() req): Promise<{ message: string }> {
    await this.authService.logout(req.user.sub);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @UseGuards(GqlAuthGuard)
  @Post('send-recover-email')
  async sendRecoverEmail(@Body('email') email: string) {
    await this.authService.sendRecoverEmail(email);
    return { message: 'Correo enviado si el usuario existe' };
  }

  @UseGuards(GqlAuthGuard)
  @Patch('update-password')
  async updatePassword(@Body() data: { token: string; new_password: string }) {
    await this.authService.updatePassword(data.token, data.new_password);
    return { message: 'Contraseña actualizada' };
  }
}
