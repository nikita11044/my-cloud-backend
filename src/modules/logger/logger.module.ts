import { Module } from '@nestjs/common';
import { PinoLoggerService } from './logger.service';
import { AppInterceptor } from './logger.interceptor';

@Module({
  providers: [AppInterceptor, PinoLoggerService],
})
export class LoggerModule {}
