import { DropDownProps, Dropdown } from "antd";
import { useDispatch } from "react-redux";
import { logOutRedux } from "../redux/slices/auth";
import { useNavigate } from "react-router-dom";

export const UserMenu: React.FC<DropDownProps> = ({ children, ...props }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Dropdown
      menu={{
        items: [
          {
            label: "Đăng xuất",
            key: "/logout",
            onClick: () => {
              dispatch(logOutRedux());
              navigate("/login");
            },
          },
        ],
      }}
      {...props}
    >
      {children}
    </Dropdown>
  );
};
