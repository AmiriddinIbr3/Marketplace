import { BadRequestException } from "@nestjs/common";
import sharp from "sharp";
import { ImageExtension } from "src/types/file-types";

export function compressImage(inputBuffer: Buffer, format: ImageExtension, quality: number): Promise<Buffer> {
    if (quality < 0 || quality > 100) {
      throw new BadRequestException('Quality must be between 0 and 100');
    }
  
    let image = sharp(inputBuffer);
  
    switch (format) {
        case 'jpg':
        case 'jpeg':
            image = image.jpeg({ quality });
            break;
        case 'png':
            image = image.png({ quality: Math.round(quality / 100 * 9) });
            break;
        case 'webp':
            image = image.webp({ quality });
            break;
        case 'tiff':
            image = image.tiff({ quality });
            break;
        case 'gif':
            image = image.gif();
            break;
        case 'heif':
            image = image.heif({ quality });
            break;
        case 'avif':
            image = image.avif({ quality });
            break;
        case 'jp2':
            image = image.jp2({ quality });
            break;
        default:
            throw new BadRequestException('Unsupported format');
    }

    return image.toBuffer();
}