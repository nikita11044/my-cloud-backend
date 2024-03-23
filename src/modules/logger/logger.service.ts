import { Logger } from 'pino';
import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService } from '@nestjs/common';
import { getLoggerConfig } from './utils';

@Injectable()
export class PinoLoggerService implements LoggerService {
  pinoLogger: Logger;

  constructor(private readonly configService: ConfigService) {
    this.pinoLogger = getLoggerConfig(
      this.configService.get('LOG_DIRECTORY', 'logs'),
    );
  }

  error(message: any, ...optionalParams: any[]): any {
    this.pinoLogger.info(message, optionalParams);
  }

  log(message: any, ...optionalParams: any[]): any {
    this.pinoLogger.info(message, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]): any {
    this.pinoLogger.info(message, optionalParams);
  }

  debug(message: any, ...optionalParams: any[]): any {
    this.pinoLogger.info(message, optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]): any {
    this.pinoLogger.info(message, optionalParams);
  }
}
