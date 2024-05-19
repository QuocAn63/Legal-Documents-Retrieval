import {
  FileOutlined,
  FlagOutlined,
  HomeFilled,
  RobotOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const items: MenuProps["items"] = [
  { label: "Trang chủ", key: "/", icon: <HomeFilled /> },
  { label: "Người dùng", key: "/users", icon: <UserOutlined /> },
  { label: "Báo cáo", key: "/reports", icon: <FlagOutlined /> },
  {
    label: "BOTs",
    key: "/bots",
    icon: <RobotOutlined />,
  },
  {
    label: "Tài liệu",
    key: "/documents",
    icon: <FileOutlined />,
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const onClick: MenuProps["onClick"] = (e) => {
    navigate(e.key);
  };
  return (
    <Menu
      items={items}
      onClick={onClick}
      mode="inline"
      selectedKeys={[location.pathname]}
      className="h-[100vh]"
    ></Menu>
  );
};
