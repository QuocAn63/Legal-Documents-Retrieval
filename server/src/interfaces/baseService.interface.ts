export default interface IBaseService<T> {
  getList<T>(...props: any): Promise<Array<T> | []>;

  get(...props: any): Promise<T>;

  save(...props: any): Promise<string>;

  update(...props: any): Promise<string>;

  delete(...props: any): Promise<string[] | string>;
}
