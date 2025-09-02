import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  private s3: AWS.S3;

  constructor(private readonly config: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      region: this.config.get('AWS_REGION', 'us-east-1'),
    });
  }

  async uploadImage(file: Express.Multer.File, folder: string): Promise<string> {
    try {
      // Optimize image with Sharp
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 85,
          progressive: true 
        })
        .toBuffer();

      const key = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
      
      const uploadParams = {
        Bucket: this.config.get('AWS_S3_BUCKET'),
        Key: key,
        Body: optimizedBuffer,
        ContentType: 'image/jpeg',
        ACL: 'private', // Secure by default
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      };

      const result = await this.s3.upload(uploadParams).promise();
      return result.Location;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('Failed to upload image');
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return this.s3.getSignedUrl('getObject', {
      Bucket: this.config.get('AWS_S3_BUCKET'),
      Key: key,
      Expires: expiresIn,
    });
  }

  async deleteImage(key: string): Promise<void> {
    await this.s3.deleteObject({
      Bucket: this.config.get('AWS_S3_BUCKET'),
      Key: key,
    }).promise();
  }
}