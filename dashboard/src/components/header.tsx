import { Avatar, Button, Flex } from "antd";
import { BellOutlined, MenuOutlined } from "@ant-design/icons";
import { UserMenu } from "./usermenu";

export const Header = () => {
  return (
    <Flex justify="space-between" align="center" className="h-[60px]">
      <Button icon={<MenuOutlined />} type="text"></Button>
      <Flex justify="space-between" align="center" gap={12}>
        <Button icon={<BellOutlined />} type="text"></Button>
        <UserMenu>
          <Avatar src="" className="cursor-pointer" />
        </UserMenu>
      </Flex>
    </Flex>
  );
};