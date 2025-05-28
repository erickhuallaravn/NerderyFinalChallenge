import {
  Controller,
  Request,
  Post,
  Body,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LogInInput } from '../auth/dtos/requests/login/login.input';
import { SignUpInput } from '../auth/dtos/requests/signup/signup.input';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() credentials: LogInInput,
  ): Promise<{ access_token: string }> {
    const token = await this.authService.login(credentials);
    return { access_token: token };
  }

  @Post('sign-up')
  async signUp(@Body() input: SignUpInput): Promise<{ access_token: string }> {
    const token = await this.authService.registerCustomer(input);
    return { access_token: token };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sign-out')
  async signOut(@Request() req): Promise<{ message: string }> {
    await this.authService.logout(req.user.sub);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('send-recover-email')
  async sendRecoverEmail(@Body('email') email: string) {
    await this.authService.sendRecoverEmail(email);
    return { message: 'Correo enviado si el usuario existe' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update-password')
  async updatePassword(@Body() data: { token: string; new_password: string }) {
    await this.authService.updatePassword(data.token, data.new_password);
    return { message: 'Contraseña actualizada' };
  }
}
