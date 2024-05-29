export type IResponseData<T = any> = {
  status: number;
  message: string;
  data: T;
  metadata?: {
    pageIndex: number;
    pageSize: number;
  };
};
