import { ExtensionWithDot } from "src/types/file-types";
import path from "path";
import fs from 'fs';
import { generateFileHash } from "./file-hash";
import { extractUniqueHashFromFilename } from "./file-name";
import sharp, { Metadata } from "sharp";
import { BadRequestException } from "@nestjs/common";

export async function getFileMetadataFromBuffer(buffer: Buffer): Promise<Metadata> {
    if (!buffer) {
        throw new BadRequestException('File is not provided')
    }

    try {
        return await sharp(buffer).metadata();
    }
    catch (error) {
        console.log(error);
        throw new Error('Error reading getting metadata');
    }
}

export async function getImageAspectRatio(image: Express.Multer.File): Promise<{
    aspectRatioWidth: number,
    aspectRatioHeight: number,
}> {
    if (!image) {
        throw new BadRequestException('Image is not provided')
    }

    const metadata = await getFileMetadataFromBuffer(image.buffer);

    const w = metadata.width;
    const h = metadata.height;
    const divisor = gcd(w, h);

    return {
        aspectRatioWidth: w / divisor,
        aspectRatioHeight: h / divisor,
    };
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

export async function getAllFilesFromFolder(folderDir: string, extensions: ExtensionWithDot[]): Promise<string[]> {
    folderDir = path.join(process.cwd(), folderDir);

    try {
        const files = await fs.promises.readdir(folderDir);
        const validFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return extensions.includes(ext as ExtensionWithDot);
        }).map(file => path.join(folderDir, file));

        return validFiles;
    }
    catch (error) {
        console.log(error);
        throw new Error('Error reading directory');
    }
}

export async function isFileUnique(folderDir: string, file: Express.Multer.File): Promise<boolean> {
    try {
        const ext = path.extname(file.originalname).toLowerCase();
        const allFiles = await getAllFilesFromFolder(folderDir, [ext as ExtensionWithDot]);
        const fileHashToCheck = await generateFileHash(file.buffer);
        
        const allHashes = allFiles.map((filePath) => {
            return extractUniqueHashFromFilename(filePath);
        });

        if (!allHashes.includes(fileHashToCheck)) {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        throw new Error('Error checking file uniqueness');
    }
}

export async function getNonUnique(folderDir: string, filesOrfile: Express.Multer.File): Promise<null | Express.Multer.File>;

export async function getNonUnique(folderDir: string, filesOrfile: Express.Multer.File[]): Promise<null | Express.Multer.File[]>;

export async function getNonUnique(folderDir: string, filesOrfile: Express.Multer.File | Express.Multer.File[]): Promise<null | Express.Multer.File | Express.Multer.File[]> {
    if (Array.isArray(filesOrfile)) {
        return await getNonUniqueFiles(folderDir, filesOrfile);
    } else {
        return await getNonUniqueFile(folderDir, filesOrfile);
    }
}

async function getNonUniqueFiles(folderDir: string, files: Express.Multer.File[]): Promise<Express.Multer.File[] | null> {
    try {
        const nonUniqueFiles = [];

        for (const file of files) {
            const isUnique = await isFileUnique(folderDir, file);

            if (!isUnique) {
                nonUniqueFiles.push(file);
            }
        }

        if (nonUniqueFiles.length === 0) {
            return null;
        }
        else {
            return files;
        }
    }
    catch (error) {
        console.log(error);
        throw new Error('Error processing non unique files');
    }
}

async function getNonUniqueFile(folderDir: string, file: Express.Multer.File): Promise<Express.Multer.File | null> {
    try {
        const isUnique = await isFileUnique(folderDir, file);

        if (!isUnique) {
            return file;
        }

        return null;
    }
    catch (error) {
        console.log(error);
        throw new Error('Error processing non unique file');
    }
}

export async function isFileUniqueComparedToOther(file: Express.Multer.File, filesOrfile: Express.Multer.File): Promise<boolean>;

export async function isFileUniqueComparedToOther(file: Express.Multer.File, filesOrfile: Express.Multer.File[]): Promise<boolean>;

export async function isFileUniqueComparedToOther(file: Express.Multer.File, filesOrfile: Express.Multer.File | Express.Multer.File[]): Promise<boolean> {
    if (Array.isArray(filesOrfile)) {
        return await isFileUniqueWithOthers(file, filesOrfile);
    } else {
        return await isFileUniqueWithOther(file, filesOrfile);
    }
}

async function isFileUniqueWithOthers(file: Express.Multer.File, files: Express.Multer.File[]): Promise<boolean> {
    try {
        for (const anotherFile of files) {
            const isUnique = await isFileUniqueWithOther(file, anotherFile);
            
            if (!isUnique) {
                return false
            }
        }

        return true;
    } catch (error) {
        console.log(error);
        throw new Error('Error checking file uniqueness with others');
    }
}

async function isFileUniqueWithOther(file: Express.Multer.File, anotherFile: Express.Multer.File): Promise<boolean> {
    try {
        const fileHash = await generateFileHash(file.buffer);
        const anotherFileHash = await generateFileHash(anotherFile.buffer);

        return fileHash !== anotherFileHash;
    } catch (error) {
        console.log(error);
        throw new Error('Error checking file uniqueness with other');
    }
}