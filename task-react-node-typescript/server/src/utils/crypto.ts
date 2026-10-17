import crypto from 'crypto';

const normalizeKey = (secret: string) =>
  crypto.createHash('sha256').update(secret).digest();

export const encryptValue = (value: string, secret: string) => {
  const iv = crypto.randomBytes(16);
  const key = normalizeKey(secret);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decryptValue = (cipherText: string, secret: string) => {
  if (!cipherText || !cipherText.includes(':')) {
    return cipherText;
  }

  const [ivHex, encryptedHex] = cipherText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  const key = normalizeKey(secret);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString('utf8');
};
