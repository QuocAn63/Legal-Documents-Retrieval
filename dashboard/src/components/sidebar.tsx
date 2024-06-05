import {
  FileOutlined,
  FlagOutlined,
  RobotOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { documentClear } from "../redux/slices/document";
import { userClear } from "../redux/slices/user";
import { reportClear } from "../redux/slices/report";

const items: MenuProps["items"] = [
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
  const dispatch = useDispatch();
  const onClick: MenuProps["onClick"] = (e) => {
    dispatch(userClear());
    dispatch(reportClear());
    dispatch(documentClear());

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
