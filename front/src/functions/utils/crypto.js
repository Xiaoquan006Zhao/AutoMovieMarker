const CryptoJS = require("crypto-js");

// Define the custom seed value as an array of 16 random bytes
const customSeed = [
  0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88, 0x09,
  0xcf, 0x4f, 0x3c,
];

// Create a WordArray object from the custom seed value
const seed = CryptoJS.lib.WordArray.create(customSeed);

// Seed the random number generator with the custom seed value
CryptoJS.lib.WordArray.random = function (nBytes) {
  const words = [];
  for (let i = 0; i < nBytes; i += 4) {
    words.push(seed.words[i >>> 2]);
  }
  return new CryptoJS.lib.WordArray.init(words, nBytes);
};

// Generate a random 16-byte value using the seeded random number generator

// Generate a secret key
const secretKey = CryptoJS.lib.WordArray.random(16);
const iv = CryptoJS.lib.WordArray.random(16);

console.log(secretKey);
console.log(iv);

const cryptParameter = {
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  iv: iv,
};

function encrypt(unencryptedData) {
  unencryptedData = unencryptedData.toString();

  // Calculate the checksum of the original data
  const checksum = CryptoJS.SHA256(unencryptedData).toString();

  // Encrypt the object
  const encryptedData = CryptoJS.AES.encrypt(
    unencryptedData,
    secretKey,
    cryptParameter
  );

  // Encode the encrypted data using Base64
  const encodedEncryptedData = CryptoJS.enc.Base64.stringify(
    CryptoJS.enc.Utf8.parse(encryptedData)
  );

  const encryptedDataAndChecksum = `${checksum}_${encodedEncryptedData}`;

  return encryptedDataAndChecksum;
}

function decrypt(encryptedDataAndChecksum) {
  // Decrypt the encrypted data
  const [checksum, encodedEncryptedData] = encryptedDataAndChecksum.split("_");

  // Decode the Base64-encoded encrypted data
  const encryptedData = CryptoJS.enc.Base64.parse(
    encodedEncryptedData
  ).toString(CryptoJS.enc.Utf8);

  // Decrypt the encrypted object
  const decryptedData = CryptoJS.AES.decrypt(
    encryptedData,
    secretKey,
    cryptParameter
  ).toString(CryptoJS.enc.Utf8);

  // Calculate the checksum of the decrypted data
  const decryptedChecksum = CryptoJS.SHA256(decryptedData).toString();

  // Verify the checksums match
  if (checksum === decryptedChecksum) {
    return decryptedData;
  } else {
    throw new RangeError("Corrupted Data!");
  }
}

module.exports = { encrypt, decrypt };
