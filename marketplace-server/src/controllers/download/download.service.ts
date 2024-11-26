import { BadRequestException, Injectable } from '@nestjs/common';
import { createReadStream, readFileSync, statSync  } from 'fs';
import { getNameWithoutHash } from 'src/helpers/file/file-name';
import { ImageDatabaseService } from 'src/services/PrismaDB/image/image-database.service';
import * as mime from 'mime-types';

@Injectable()
export class DownloadService {
    constructor(private readonly imageDatabase: ImageDatabaseService) {}

    async imageBuffer(id: string) {
        const { url, cleanName, size, mimeType } = await this.findImageUrlById(id);

        const file = readFileSync(url);
        return { file, cleanName, size, mimeType };
    }

    async imageStream(id: string) {
        const { url, cleanName, size, mimeType } = await this.findImageUrlById(id);

        const file = createReadStream(url);
        return { file, cleanName, size, mimeType };
    }

    async fileBuffer(id: string) {
        const { url, cleanName, size, mimeType } = await this.findImageUrlById(id);

        const file = readFileSync(url);
        return { file, cleanName, size, mimeType };
    }

    async fileStream(id: string) {
        const { url, cleanName, size, mimeType } = await this.findImageUrlById(id);

        const file = createReadStream(url);
        return { file, cleanName, size, mimeType };
    }

    async findImageUrlById(id: string) {
        const image = await this.imageDatabase.findUniqueById(id);
        if (!image) {
            throw new BadRequestException('File not found');
        }
        
        const cleanName = getNameWithoutHash(image.url);
        const mimeType = mime.lookup(cleanName) || 'application/octet-stream';
        const stats = statSync(image.url);
        const size = stats.size;

        return { url: image.url, cleanName, size, mimeType };
    }
}