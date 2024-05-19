export type IResponseData = {
  status: number;
  message?: string;
  data?: any;
  metadata?: {
    pageIndex: number;
    pageSize: number;
  };
};
