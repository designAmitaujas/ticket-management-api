import Cryptr from "cryptr";
import { PASS_STRING } from "../env";

const cryptr = new Cryptr(PASS_STRING);

export const encryptedString = (pass: string) => cryptr.encrypt(pass);

export const decryptedString = (pass: string) => cryptr.decrypt(pass);

export const isEncryptedString = (str: string): boolean => {
  try {
    cryptr.decrypt(str);
    return true;
  } catch (err) {
    return false;
  }
};

export const isPasswordValid = (
  plainPassword: string,
  encryptedPassword: string
) => {
  return plainPassword === decryptedString(encryptedPassword);
};
