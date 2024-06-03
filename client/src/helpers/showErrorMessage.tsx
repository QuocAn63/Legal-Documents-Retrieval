import { MessageInstance } from "antd/es/message/interface";

export const ShowMessagesFromError = (err: any, api: MessageInstance) => {
  let message = err?.response?.message || err?.message || err;
  if (typeof message === "object" && Array.isArray(message)) {
    message.forEach((msg) => api.error(msg));
  } else {
    api.error(message);
  }
};
