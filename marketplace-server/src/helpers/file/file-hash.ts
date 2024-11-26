import crypto from 'crypto';

export async function generateFileHash(buffer: Buffer): Promise<string> {
    const hash = await crypto.createHash('sha256');
    await hash.update(buffer);
    return hash.digest('hex');
}