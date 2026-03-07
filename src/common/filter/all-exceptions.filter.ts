import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof Error ? exception.message : 'Unknown error';
    this.logError(
      message,
      status,
      request,
      exception instanceof Error ? exception.stack : undefined,
    );
    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
    });
  }

  private logError(
    message: string,
    status: number,
    request: Request,
    stack?: string,
  ) {
    const source = this.parseSourceFromStack(stack);
    const sourceInfo = source ? ` [${source}]` : '';
    if (status >= 500) {
      this.logger.error(
        `[${status}] ${request.method} ${request.url} - ${message}${sourceInfo}`,
        stack,
      );
    } else {
      this.logger.warn(
        `[${status}] ${request.method} ${request.url} - ${message}${sourceInfo}`,
      );
    }
  }

  private parseSourceFromStack(stack?: string): string | null {
    if (!stack) return null;
    const lines = stack.split('\n').slice(1);
    const frameRe =
      /at\s+(?:(\S+)\s+\()?(?:.*[\/\\])?(?:src|dist)[\/\\]([^:]+):(\d+):(\d+)/;
    for (const line of lines) {
      const match = line.trim().match(frameRe);
      if (match) {
        const [, fn, file, lineNum] = match;
        const module = file.replace(/\.(ts|js)$/, '').replace(/[\/\\]/g, '.');
        return fn ? `${module}.${fn}` : `${module}:${lineNum}`;
      }
    }
    return null;
  }
}
