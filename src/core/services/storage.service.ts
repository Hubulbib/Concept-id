import { UploadedFile } from 'express-fileupload'
import { StorageRepository } from '../repositories/storage/storage.repository.js'

export class StorageService {
  constructor(private readonly storageRepository: StorageRepository) {}

  getFile = async (url: string): Promise<string> => {
    const fileId = url.split('/').pop()
    return await this.storageRepository.getFile(fileId)
  }

  uploadFile = async (file: UploadedFile): Promise<string> => {
    return await this.storageRepository.uploadFile(file)
  }
}
