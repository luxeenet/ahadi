import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';

export const STORAGE_CLIENT = 'STORAGE_CLIENT';

/**
 * Global S3-compatible storage module.
 * In development, points to local MinIO.
 * In production, can point to AWS S3, Cloudflare R2, or Google Cloud Storage.
 *
 * Never access storage directly — always go through StorageService
 * (implemented in Phase 6) for upload/download/signed URL operations.
 */
@Global()
@Module({
  providers: [
    {
      provide: STORAGE_CLIENT,
      useFactory: (config: ConfigService): S3Client => {
        const endpoint = config.get<string>('STORAGE_ENDPOINT');
        const region = config.get<string>('STORAGE_REGION', 'us-east-1');
        const accessKeyId = config.get<string>('STORAGE_ACCESS_KEY', '');
        const secretAccessKey = config.get<string>('STORAGE_SECRET_KEY', '');
        const provider = config.get<string>('STORAGE_PROVIDER', 'minio');

        return new S3Client({
          endpoint: provider !== 's3' ? endpoint : undefined,
          region,
          credentials: { accessKeyId, secretAccessKey },
          forcePathStyle: provider === 'minio', // MinIO requires path-style
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [STORAGE_CLIENT],
})
export class StorageModule {}
