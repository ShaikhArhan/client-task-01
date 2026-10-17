import CryptoJS from 'crypto-js';

const secret = import.meta.env.VITE_FRONTEND_SECRET || 'student_frontend_secret';

const getKey = () => CryptoJS.SHA256(secret);

export const encryptValue = (value: string) => {
  if (!value) return '';

  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(value, getKey(), {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  return `${iv.toString(CryptoJS.enc.Hex)}:${encrypted.ciphertext.toString(CryptoJS.enc.Hex)}`;
};

export const decryptValue = (cipherText: string) => {
  if (!cipherText) return '';
  if (!cipherText.includes(':')) return cipherText;

  try {
    const [ivHex, encryptedHex] = cipherText.split(':');
    const iv = CryptoJS.enc.Hex.parse(ivHex);
    const ciphertext = CryptoJS.enc.Hex.parse(encryptedHex);
    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({ ciphertext }),
      getKey(),
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch {
    return cipherText;
  }
};
