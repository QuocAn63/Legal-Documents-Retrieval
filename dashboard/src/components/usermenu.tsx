import { DropDownProps, Dropdown } from "antd";

export const UserMenu: React.FC<DropDownProps> = ({ children, ...props }) => {
  return (
    <Dropdown
      menu={{
        items: [
          {
            label: "Đăng xuất",
            key: "/logout",
            onClick: () => {},
          },
        ],
      }}
      {...props}
    >
      {children}
    </Dropdown>
  );
};
