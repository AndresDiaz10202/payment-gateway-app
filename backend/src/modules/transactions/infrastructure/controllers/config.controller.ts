import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('api/config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('public-key')
  getPublicKey() {
    return {
      publicKey: this.configService.get<string>('PUBLIC_KEY'),
      sandboxUrl: this.configService.get<string>('SANDBOX_URL'),
    };
  }
}