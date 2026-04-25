import { EncryptStorage } from 'encrypt-storage';

let encryptStorage = new EncryptStorage(process.env.REACT_APP_LOCAL_STORAGE_SECRET, {
  prefix: '@dr-web',
});

export default encryptStorage;