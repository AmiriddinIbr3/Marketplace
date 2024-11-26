import { BadRequestException, HttpStatus } from "@nestjs/common";
import path from "path";
import fs from 'fs';
import { generateFilename } from "./file-name";
import { isFileUnique } from "./file-checker";

export async function create(uploadDir: string, file: Express.Multer.File): Promise<string>;

export async function create(uploadDir: string, files: Express.Multer.File[]): Promise<string[]>;

export async function create(uploadDir: string, fileOrFiles: Express.Multer.File | Express.Multer.File[]): Promise<string | string[]> {
    if (Array.isArray(fileOrFiles)) {
        return await createFiles(uploadDir, fileOrFiles);
    } else {
        return await createFile(uploadDir, fileOrFiles);
    }
}

async function createFiles(uploadDir: string, files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const fileNameMap: Map<string, boolean> = new Map();
    
    for (const file of files) {
        try {
            const fileName = await generateFilename(file);
            const filePath = path.join(process.cwd(), uploadDir, fileName);

            fileNameMap.set(filePath, file.copiedPath);
                
            if (!file.copiedPath) {
                await createFileUnsafe(uploadDir, file.buffer, filePath);
            }
        } 
        catch (err) {
            for (const [filePath, isCopied] of fileNameMap) {
                if (filePath && !isCopied) {
                    await deleteFile(filePath);
                }
            }

            console.error(`Error during file creation: ${err.message}`);
            throw new BadRequestException('Error during file creation');
        }
    }
    
    return Array.from(fileNameMap.keys());
}

async function createFile(uploadDir: string, file: Express.Multer.File): Promise<string> {
    if (!file) {
        throw new BadRequestException('No file provided');
    }

    let filePath;
    try {
        const fileName = await generateFilename(file);
        const filePath = path.join(process.cwd(), uploadDir, fileName);

        if (!file.copiedPath) {
            await createFileUnsafe(uploadDir, file.buffer, filePath);
        }

        return filePath;
    }
    catch (err) {
        if (!file.copiedPath) {
            await deleteFile(filePath);
        }

        console.error(`Error during file creation: ${err.message}`);
        throw new BadRequestException('Error during file creation');
    }
}

async function createFileUnsafe(uploadDir: string, fileBuffer: Buffer, filePath: string): Promise<void> {
    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.writeFile(filePath, fileBuffer);
}

async function deleteFile(filePath: string) {
    if (filePath) {
        try {
            await fs.promises.unlink(filePath);
        }
        catch (err) {
            console.error(`Failed to delete file: ${err.message}`);
            throw new Error('Failed to delete file');
        }
    }
}

export async function createOnlyUnique(folderDir: string, filesOrfile: Express.Multer.File): Promise<null | Express.Multer.File>;

export async function createOnlyUnique(folderDir: string, filesOrfile: Express.Multer.File[]): Promise<null | Express.Multer.File[]>;

export async function createOnlyUnique(folderDir: string, filesOrfile: Express.Multer.File | Express.Multer.File[]): Promise<null | Express.Multer.File | Express.Multer.File[]> {
    if (Array.isArray(filesOrfile)) {
        return await createOnlyUniqueFiles(folderDir, filesOrfile);
    } else {
        return await createOnlyUniqueFile(folderDir, filesOrfile);
    }
}

async function createOnlyUniqueFiles(folderDir: string, files: Express.Multer.File[]): Promise<Express.Multer.File[] | null> {
    try {
        const nonUniqueFiles = [];

        for (const file of files) {
            const nonUniqueFile = await createOnlyUniqueFile(folderDir, file);

            if (nonUniqueFile) {
                nonUniqueFiles.push(nonUniqueFile);
            }
        }

        if (nonUniqueFiles.length === 0) {
            return null;
        }
        else {
            return nonUniqueFiles;
        }
    }
    catch (error) {
        console.error(`Error creating unique files: ${error.message}`);
        throw new BadRequestException('Error processing unique files');
    }
}

async function createOnlyUniqueFile(folderDir: string, file: Express.Multer.File): Promise<Express.Multer.File | null> {
    try {
        const isUnique = await isFileUnique(folderDir, file);

        if (isUnique) {
            await create(folderDir, file);
            return null;
        }
        else {
            return file;
        }
    }
    catch (error) {
        console.error(`Error creating unique file: ${error.message}`);
        throw new BadRequestException('Error processing unique file');
    }
}

export function sendNonUniqueFiles(nonUniqueFiles: Express.Multer.File[]) {
    const fileNames = nonUniqueFiles.map(file => file.originalname);
  
    throw new BadRequestException({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Some files are not unique',
      nonUniqueFiles: fileNames
    });
}

export function copyFile(file: Express.Multer.File, newFieldName: string): Express.Multer.File {
    const { originalname, encoding, mimetype, size, filename, path, stream, destination, buffer } = file;
    return {
        fieldname: newFieldName,
        copiedPath: true,
        originalname,
        encoding,
        mimetype,
        size,
        filename,
        path,
        stream,
        destination,
        buffer,
    }
}