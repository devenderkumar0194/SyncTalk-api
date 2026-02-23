import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
config();

@Injectable()
export class UploadsService {
    private s3: AWS.S3;

    constructor() {
        const awsConfig = new AWS.Config({
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
            region: process.env.DO_REGION,
            credentials: {
                accessKeyId: process.env.DO_ACCESS_KEY,
                secretAccessKey: process.env.DO_SECRET_ACCESS_KEY,
            },
        } as AWS.ConfigurationOptions);
        // Manually set the endpoint as it's not part of AWS.Config type definition
        (awsConfig as any).endpoint = process.env.DO_UPLOAD_ENDPOINT;
        this.s3 = new AWS.S3(awsConfig);
    }

    private async uploadFilesOnS3(key: string, file, fileBuffer: Buffer) {
        const params: AWS.S3.Types.PutObjectRequest = {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ACL: 'public-read',
            ContentType: file.mimetype,
        };
        return this.s3.upload(params).promise();
    }

    async uploadProfile(file: any, fileBuffer: Buffer) {
        const key = `profiles/${file.originalname}`;
        const result = await this.uploadFilesOnS3(key, file, fileBuffer);
        const imageName = result.Key.split('/').pop();
        return {
            imageName,
            url: result.Location,
            key: result.Key,
        };
    }
}
