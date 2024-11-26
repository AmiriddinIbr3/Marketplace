import { BadRequestException } from '@nestjs/common';
import { getFilenameWithoutExtension } from 'src/helpers/file/file-name';
import { MimeType } from 'src/types/file-types';

export class FileValidation {
  constructor(
    private readonly maxMBSize: number,
    private readonly allowedFileTypes: MimeType[],
  ) {
    this.maxMBSize = maxMBSize * 1024 * 1024;
  }

  async transform(file: Express.Multer.File): Promise<Express.Multer.File>;
  async transform(files: Express.Multer.File[], totalPlaceInMB?: number): Promise<Express.Multer.File[]>;

  async transform(fileOrFiles: Express.Multer.File | Express.Multer.File[], totalPlaceInMB?: number): Promise<Express.Multer.File | Express.Multer.File[]> {
    if (Array.isArray(fileOrFiles)) {
      return await this.validateFiles(fileOrFiles, totalPlaceInMB);
    } else {
      return await this.validateFile(fileOrFiles);
    }
  }

  private async validateFile(file: Express.Multer.File): Promise<Express.Multer.File> {
    const { fileTypeFromBuffer } = (await import('file-type'));

    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (file.size > this.maxMBSize) {
      throw new BadRequestException(`File size exceeds ${this.maxMBSize / (1024 * 1024)}MB`);
    }

    if (!this.allowedFileTypes.includes(file.mimetype as MimeType)) {
      throw new BadRequestException('Invalid file type');
    }
    
    let ext, mime;
    try {
      const fileType = await fileTypeFromBuffer(file.buffer);

      if (fileType) {
        ext = fileType.ext
        mime = fileType.mime

        if (mime !== file.mimetype) {
          throw new BadRequestException(`MIME type mismatch: expected '${file.mimetype}', but got '${mime}'`);
        }
      }
      else {
        throw new BadRequestException('Unable to determine file type');
      }
    } catch(err) {
      throw new BadRequestException('Unable to determine file type');
    }
    
    try {
      const basename = getFilenameWithoutExtension(file);
      const invalidCharacters = /[\\/:*?"<>|^]/;
      const validCharacters = /^[\w\s!#$%&'()+,;=@[\]^_`{}~*/?|\\.\p{L}\p{N}-]*$/u;
    
      if (invalidCharacters.test(basename)) {
        throw new BadRequestException('The string contains invalid characters: \\ / : * ? " < > | ^');
      }
      
      if (!validCharacters.test(basename)) {
        throw new BadRequestException('The string contains invalid characters');
      }
    }
    catch (e) {
      throw new BadRequestException('The string contains invalid characters');
    }

    return file;
  }

  private async validateFiles(files: Express.Multer.File[], totalPlaceInMB?: number): Promise<Express.Multer.File[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    if (totalPlaceInMB !== undefined) {
      const totalSize = files.reduce((acc, file) => acc + file.size, 0);
      if (totalSize > totalPlaceInMB * 1024 * 1024) {
        throw new BadRequestException(`Total file size exceeds ${totalPlaceInMB}MB`);
      }
    }

    for (const file of files) {
      await this.validateFile(file);
    }

    return files;
  }
}