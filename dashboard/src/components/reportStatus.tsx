const ReportStatusItems = ["Chưa xử lý", "Đang xử lý", "Đã xử lý"];

export const ReportStatus = ({ status = 0 }) => {
  return ReportStatusItems[status];
};
