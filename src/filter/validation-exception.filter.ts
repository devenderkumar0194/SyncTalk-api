import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Extract first error message (instead of an array)
        let errorMessage = 'An error occurred';
        if (typeof exceptionResponse === 'object' && exceptionResponse.hasOwnProperty('message')) {
            const messages = (exceptionResponse as any).message;
            if (Array.isArray(messages) && messages.length > 0) {
                errorMessage = messages[0]; // Get the first error message
            } else if (typeof messages === 'string') {
                errorMessage = messages;
            }
        }

        // Custom response format
        response.status(status).json({
            success: false,
            message: errorMessage, // Single error message
        });
    }
}
