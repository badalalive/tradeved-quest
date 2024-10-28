import crypto from 'crypto';

const publicKey = process.env.RSA_PUBLIC_KEY?.replace(/\\n/g, '\n') || '';

export function encryptData(data: string): string {
    const encryptedData = crypto.publicEncrypt(publicKey, Buffer.from(data));
    return encryptedData.toString('base64');
}
