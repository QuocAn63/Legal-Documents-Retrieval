import { IQueryParams } from 'src/interfaces/query.interface';

export default class OffsetUtil {
  static getOffset(pagination: IQueryParams): number {
    const { pageSize, pageIndex } = pagination;
    return pageSize * (pageIndex - 1);
  }
}
