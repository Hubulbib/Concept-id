import { UploadedFile } from 'express-fileupload'

export interface StorageRepository {
  getFile: (url: string) => Promise<string>
  uploadFile: (file: UploadedFile) => Promise<string>
}
