const CryptoJS = require("crypto-js");

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
