export class AnnualLeaveCache {
  private static readonly KEY: string = 'annual-leave-cache';

  static getCache(): any {
    const cache: any = {};
    const cacheObj = localStorage.getItem(this.KEY);
    if (cacheObj) {
      return JSON.parse(cacheObj);
    } else {
      this.saveCache(cache);
    }
    return cache;
  }

  private static saveCache(cache: any): void {
    localStorage.setItem(this.KEY, JSON.stringify(cache));
  }

  static clearCache(): void {
    const cache: any = {};
    this.saveCache(cache);
  }

  static getItem(key: string): any {
    return this.getCache()[key];
  }

  static setItem(key: string, obj: any): void {
    const cache: any = this.getCache();
    cache[key] = obj;
    this.saveCache(cache);
  }

  static deleteItem(key: string): void {
    const cache: any = this.getCache();
    delete cache[key];
    this.saveCache(cache);
  }
}
