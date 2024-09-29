import { S3 } from '@aws-sdk/client-s3'

export const storage = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  endpoint: process.env.AWS_CLIENT,
  forcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})

export const bucketName = process.env.AWS_BUCKET_NAME
export const storageBase = process.env.AWS_CLIENT
