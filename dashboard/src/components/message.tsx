import { Avatar, Flex, Image, Typography } from "antd";
import { IMessage } from "../models/message.model";

export const MessageItem = ({ id, content, userID, isBOT }: IMessage) => {
  return (
    <>
      <Flex align="flex-start" gap={16}>
        <div style={{ width: "24px", height: "24px" }}>
          <Avatar
            src={isBOT ? "/bot-avatar.png" : "/default-avatar.png"}
            shape="circle"
            style={{ width: "24px" }}
          />
        </div>
        <Flex gap={8} vertical>
          <Typography.Text strong>
            {isBOT ? "BOT" : `USER (${userID})`}
          </Typography.Text>
          <Typography.Text>{content}</Typography.Text>
        </Flex>
      </Flex>
    </>
  );
};
