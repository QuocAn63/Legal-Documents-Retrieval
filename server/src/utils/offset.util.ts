export default class OffsetUtil {
  static getOffset(pageIndex: number, pageSize: number): number {
    return pageSize * (pageIndex - 1);
  }
}
