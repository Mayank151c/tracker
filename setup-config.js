import fs from 'fs';
import CryptoJS from 'crypto-js';

function encryptConfig(config, secret) {
  const newConfig = CryptoJS.AES.encrypt(JSON.stringify(config), secret).toString();
  console.log(newConfig);
  fs.writeFileSync('.firebase-config', encryptConfig('0090'));
}

const config = {}; // Replace with your Firebase config
const secret = ''; // Replace with your encryption key

encryptConfig(config, secret);
