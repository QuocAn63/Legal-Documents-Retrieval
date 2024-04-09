import { FindOptionsWhere } from 'typeorm';
import { IQueryParams } from './query.interface';

export default interface IBaseService<T> {
  getList(
    entityParams: FindOptionsWhere<T>,
    query: IQueryParams,
    ...props: any
  ): Promise<T[] | []>;

  get(entityParams: FindOptionsWhere<T>, ...props: any): Promise<T>;

  save(...props: any): Promise<string>;

  update(...props: any): Promise<string>;

  delete(...props: any): Promise<string[] | string>;
}
