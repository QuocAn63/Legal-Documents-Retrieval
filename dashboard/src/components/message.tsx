import { Avatar, Flex, Image, Space, Typography } from "antd";
import { IMessage } from "../models/message.model";

export const MessageItem = ({ id, content, userID, isBOT }: IMessage) => {
  return (
    <>
      <Space direction="vertical">
        <Space>
          <Avatar
            size={32}
            src={isBOT ? "/bot-avatar.png" : "/default-avatar.png"}
          />
          <Typography.Text strong>
            {isBOT ? "BOT" : `USER (${userID})`}
          </Typography.Text>
        </Space>
        <div className="ml-10">
          <Typography.Text>{content}</Typography.Text>
        </div>
      </Space>
    </>
  );
};
