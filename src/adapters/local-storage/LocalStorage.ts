export class LocalStorage {
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(error);
      throw new Error("Error setting item " + key + ":" + value);
    }
  }

  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
      throw new Error("Error removing item " + key);
    }
  }
}
