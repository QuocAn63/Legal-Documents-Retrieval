export type IQueryParams = {
  pageIndex?: number;
  pageSize?: number;
  fromDate?: string;
  toDate?: string;
};

export type IQueryMetadata = {
  pageIndex: number;
  pageSize: number;
  totalPages: number;
};
