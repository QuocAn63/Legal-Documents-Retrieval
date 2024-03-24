export interface IQueryMetaData {
  pageIndex?: number;
  pageSize?: number;
  where?: string;
}

export interface IResponseData<T = any> {
  status: number;
  message?: string;
  data?: T;
}
