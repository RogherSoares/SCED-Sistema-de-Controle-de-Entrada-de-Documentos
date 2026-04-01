import { Controller, Get, Redirect } from '@nestjs/common';
import { Public } from '../auth/public.decorator';

@Controller()
export class AppController {
  @Public()
  @Get()
  @Redirect('/login.html')
  redirectToLogin(): void {
    return;
  }
}
