import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { ApiBody, ApiConsumes, ApiProperty } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

export class FileUploadDto {
    @ApiProperty({ type: 'string', format: 'binary' })
    file: any;
}

@Controller('uploads')
export class UploadsController {

    constructor(
        private readonly uploadsService: UploadsService,
    ) { }

    @Post('profile')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @UseInterceptors(FileInterceptor('file'))
    async uploadProfile(@UploadedFile() file: any) {
        const result = await this.uploadsService.uploadProfile(file, file.buffer);
        return {
            message: 'Profile image uploaded successfully',
            data: result
        };
    }

}
