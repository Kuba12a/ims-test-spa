import { SHA256 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';

export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(array)));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function generateCodeChallenge(verifier: string): string {
  const hash = SHA256(verifier);
  const base64 = Base64.stringify(hash);

  
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}