import { S3 } from '@aws-sdk/client-s3'

export const storage = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  endpoint: '',
  forcePathStyle: true,
  region: 'ru-1',
  apiVersion: 'latest',
})

export const BUCKET_NAME = process.env.AWS_BUCKET_NAME
