import { genSalt, hash, compare } from 'bcrypt';

export default class HashUtil {
  static async hash(plainText: string, saltNumber = 10): Promise<string> {
    const salt = await genSalt(saltNumber);

    return hash(plainText, salt);
  }

  static async compare(
    plainText: string,
    encryptedText: string,
  ): Promise<boolean> {
    return compare(plainText, encryptedText);
  }
}
