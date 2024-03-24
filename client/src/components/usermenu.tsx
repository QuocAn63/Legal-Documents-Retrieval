import { Dropdown, Flex, Image, Modal, ModalProps, Space } from "antd";
import { ReactNode } from "react";
import CustomButton from "./button";
import styles from "../styles/usermenu.module.scss";
import classNames from "classnames/bind";
import {
  CloseOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Title from "antd/es/typography/Title";
import { Typography } from "antd";
import { useRef } from "react";
const { Text } = Typography;
const cx = classNames.bind(styles);

interface SettingHandlersProps {
  modalOpenHandler: () => void;
  modalCloseHandler: () => void;
}

interface MenuSelectionsProps {
  settingHandlers: SettingHandlersProps;
  logoutHandlers?: any;
}

interface SettingModalItem {
  title: string;
  button: ReactNode;
}

const SettingModalItem = ({ title, button }: SettingModalItem) => {
  return (
    <Flex justify="space-between" align="center" className={cx("settingItem")}>
      <Text className={cx("title")}>{title}</Text>
      {button}
    </Flex>
  );
};

const SettingModal = ({ ...props }: ModalProps) => {
  return (
    <Modal {...props}>
      <div className={cx("modalWrapper")}>
        <Title level={4} className={cx("title")}>
          Cài đặt
        </Title>
        <span className="horizontal"></span>
        <div className={cx("btnContainer")}>
          <SettingModalItem
            title="Giao diện"
            button={<CustomButton outlined>Tối</CustomButton>}
          />
          <span className="horizontal"></span>
          <SettingModalItem
            title="Các hội thoại đã lưu"
            button={<CustomButton outlined>Quản lý</CustomButton>}
          />
          <span className="horizontal"></span>
          <SettingModalItem
            title="Các liên kết đã chia sẻ"
            button={<CustomButton outlined>Quản lý</CustomButton>}
          />
          <span className="horizontal"></span>
          <SettingModalItem
            title="Xóa tất cả hội thoại"
            button={
              <CustomButton outlined status="important" background>
                Xóa tất cả
              </CustomButton>
            }
          />
          <span className="horizontal"></span>
          <SettingModalItem
            title="Xóa tài khoản"
            button={
              <CustomButton outlined status="important" background>
                Xóa
              </CustomButton>
            }
          />
        </div>
      </div>
    </Modal>
  );
};

const MenuSelections = ({ settingHandlers }: MenuSelectionsProps) => {
  const { modalCloseHandler, modalOpenHandler } = settingHandlers;

  return (
    <div className={cx("selectionsContainer")}>
      <Space direction="vertical" size={0} style={{ width: "100%" }}>
        <CustomButton
          block
          icon={<SettingOutlined />}
          onClick={modalOpenHandler}
          className={cx("btn")}
        >
          Cài đặt
        </CustomButton>
        <span className="horizontal"></span>
        <CustomButton block icon={<LogoutOutlined />} className={cx("btn")}>
          Đăng xuất
        </CustomButton>
      </Space>
    </div>
  );
};

export default function UserMenu() {
  const [state, setState] = useState({ isOpen: false });
  const userMenuRef = useRef(null);

  const settingHandlers: SettingHandlersProps = {
    modalOpenHandler: () => {
      setState((prev) => ({ ...prev, isOpen: true }));
    },
    modalCloseHandler: () => {
      setState((prev) => ({ ...prev, isOpen: false }));
    },
  };

  return (
    <>
      <SettingModal
        open={state.isOpen}
        destroyOnClose
        footer={null}
        styles={{
          content: {
            backgroundColor: "#2F2F2F",
          },
        }}
        onCancel={settingHandlers.modalCloseHandler}
        closeIcon={<CloseOutlined className={cx("btnClose")} />}
      />
      <Dropdown
        dropdownRender={() => (
          <MenuSelections settingHandlers={settingHandlers} />
        )}
        trigger={["click"]}
        getPopupContainer={() => {
          return userMenuRef.current || document.body;
        }}
      >
        <div className={cx("wrapper")} ref={userMenuRef}>
          <Space size={8}>
            <Image
              src="/default-avatar.png"
              preview={false}
              width={40}
              height={40}
              className={cx("avatarHolder")}
            />
            <span className={cx("username")}>User</span>
          </Space>
        </div>
      </Dropdown>
    </>
  );
}
