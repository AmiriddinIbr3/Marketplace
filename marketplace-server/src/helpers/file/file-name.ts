import path from "path";
import { generateFileHash } from "./file-hash";

export async function generateFilename(file: Express.Multer.File): Promise<string> {
    const basename = getFilenameWithoutExtension(file);
    const uniqueHash = await generateFileHash(file.buffer);
    const extension = path.extname(file.originalname);
    return `${basename}^${uniqueHash}${extension}`;
}

export function getNameWithoutHash(url: string) {
    const filename = path.basename(url);
    const extension = path.extname(filename);
    const cleanName = filename.split('^')[0];
    return `${cleanName}${extension}`;
}

export function getFilenameWithoutExtension(file: Express.Multer.File): string {
    const filename = file.originalname;
    const extension = path.extname(filename);
    const lastDotIndex = filename.lastIndexOf(extension);
    return filename.slice(0, lastDotIndex);
}

export function extractUniqueHashFromFilename(filename: string): string {
    const baseNamePart = path.basename(filename, path.extname(filename));
    const hashMatch = baseNamePart.match(/\^(\w+)$/);
    return hashMatch[1];
}