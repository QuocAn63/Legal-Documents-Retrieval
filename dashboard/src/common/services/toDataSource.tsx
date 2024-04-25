export const ToDataSource = (data: Record<string, any>[]) => {
  const dataSource = data.map((item: any) => ({ ...item, key: item.id }));

  return dataSource;
};
