import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request:`, {
      headers: req.headers,
      body: req.body,
      originalUrl: req.originalUrl,
    });

    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunkBuffers = [];

    res.write = (...chunks) => {
      const resArgs = [];
      for (let i = 0; i < chunks.length; i++) {
        resArgs[i] = chunks[i];
        if (!resArgs[i]) {
          res.once('drain', res.write);
          i--;
        }
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      return rawResponse.apply(res, resArgs);
    };

    res.end = (...chunk) => {
      const resArgs = [];
      for (let i = 0; i < chunk.length; i++) {
        resArgs[i] = chunk[i];
      }
      if (resArgs[0]) {
        chunkBuffers.push(Buffer.from(resArgs[0]));
      }
      const body = Buffer.concat(chunkBuffers).toString('utf8');
      res.setHeader('origin', 'req-res-logging');
      const responseLog = {
        response: {
          statusCode: res.statusCode,
          body: JSON.parse(body) || body || {},
          // Returns a shallow copy of the current outgoing headers
          headers: res.getHeaders(),
        },
      };
      console.log('Response: ', responseLog);
      rawResponseEnd.apply(res, resArgs);
      return responseLog as unknown as Response;
    };

    if (next) {
      next();
    }
  }
}
