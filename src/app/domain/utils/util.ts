export class Util {
  static includesFilter(obj: any, filter: string): boolean {
    return JSON.stringify(obj)
      .toLowerCase()
      .includes(filter);
  }

  static getDaysBetweenTwoDates(startDate: Date, endDate: Date): number {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const utc2 = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }

  static getCSVStringFromArray(array: any): string {
    return JSON.stringify(array)
      .replace('{', '')
      .replace('}', '')
      .replace(',', ';');
  }

  static exportRowsToCSV(rows: string[][], name: string = 'report'): void {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const anchor = document.createElement('a');
    anchor.setAttribute('href', encodedUri);
    anchor.setAttribute('download', name + '.csv');
    document.body.appendChild(anchor);
    anchor.click();
  }
}
