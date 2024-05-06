export type ResponseDataType = {
  status: number;
  message?: string;
  data?: any;
  metadata?: {
    pageIndex: number;
    pageSize: number;
  };
};
