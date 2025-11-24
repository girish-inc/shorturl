import crypto from 'crypto';

export function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(length);
  let code = '';

  for (let i = 0; i < length; i += 1) {
    code += chars[bytes[i] % chars.length];
  }

  return code;
}

export function validateUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateCode(code) {
  return /^[A-Za-z0-9]{6,8}$/.test(code);
}

