import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JWTInvalidError } from 'src/auth/types';
import { CookieService } from './auth/cookie/cookie.service';

@Catch()
export class GlobalFilter implements ExceptionFilter {
  constructor() {}

  async catch(exception: unknown, host: ArgumentsHost): Promise<void> {
    Logger.log('GLOBAL FILTER');
    Logger.log({ exception });

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    try {
      if (exception instanceof JWTInvalidError) {
        Logger.log('JWT FILTER');
        throw new UnauthorizedException('Please log in again');
      }
    } catch (err: any) {
      Logger.log('RECAUGHT GLOBAL FILTER');
      return this.sendResponse(res, req, err);
    }

    return this.sendResponse(res, req, exception);
  }

  private sendResponse(res: Response, req: Request, err: any) {
    Logger.log('FINAL ERROR: ', { err });

    const status =
      err?.getStatus?.() ?? err?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      err?.getResponse?.().message ?? err.message ?? 'Internal Server Error';

    message =
      status === HttpStatus.INTERNAL_SERVER_ERROR
        ? 'Internal Server Error'
        : message;

    res.status(status).json({
      statusCode: status,
      method: req.method,
      path: req.url,
      message,
    });
  }
}