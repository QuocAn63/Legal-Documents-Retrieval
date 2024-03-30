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
import { useDispatch } from "react-redux";
import { logOutRedux } from "../redux/user";

// Manage Modal ( Archive and Share Modal)
import ManageModal from "./modals/manage.tsx";

const { Text } = Typography;
const cx = classNames.bind(styles);

interface SettingHandlersProps {
  modalOpenHandler: () => void;
  modalCloseHandler: () => void;
}

interface ManageHandlersProps {
  modalManageOpenHandler: () => void;
  modalManageCloseHandler: () => void;
}

interface SettingModalProps {
  manageHandlers: ManageHandlersProps;
  settingHandlers: SettingHandlersProps;
  setTypeHandlers: TypeHandlersProps;
  props: ModalProps;
}

interface MenuSelectionsProps {
  settingHandlers: SettingHandlersProps;
  logoutHandlers?: any;
}

interface SettingModalItem {
  title: string;
  button: ReactNode;
}

interface TypeHandlersProps {
  modalType: () => void;
}

const SettingModalItem = ({ title, button }: SettingModalItem) => {
  return (
    <Flex justify="space-between" align="center" className={cx("settingItem")}>
      <Text className={cx("title")}>{title}</Text>
      {button}
    </Flex>
  );
};

const SettingModal = ({
  setTypeHandlers,
  settingHandlers,
  manageHandlers,
  ...props
}: SettingModalProps) => {
  const { modalManageOpenHandler } = manageHandlers;
  const { modalCloseHandler } = settingHandlers;
  const { modalType } = setTypeHandlers;

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
            button={
              <CustomButton
                outlined
                onClick={() => {
                  modalCloseHandler();
                  modalManageOpenHandler();
                }}
              >
                Quản lý
              </CustomButton>
            }
          />
          <span className="horizontal"></span>
          <SettingModalItem
            title="Các liên kết đã chia sẻ"
            button={
              <CustomButton
                outlined
                onClick={() => {
                  modalCloseHandler();
                  modalManageOpenHandler();
                  modalType();
                }}
              >
                Quản lý
              </CustomButton>
            }
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
  const { modalOpenHandler } = settingHandlers;

  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logOutRedux());
  };

  return (
    <div className={cx("selectionsContainer")}>
      <Space direction="vertical" size={0}>
        <CustomButton
          block
          icon={<SettingOutlined />}
          onClick={modalOpenHandler}
          className={cx("btn")}
        >
          Cài đặt
        </CustomButton>
        <span className="horizontal"></span>
        <CustomButton
          block
          icon={<LogoutOutlined />}
          className={cx("btn")}
          onClick={handleLogOut}
        >
          Đăng xuất
        </CustomButton>
      </Space>
    </div>
  );
};

export default function UserMenu() {
  const [state, setState] = useState({
    isOpen: false,
    isOpenManage: false,
    type: 0,
  });
  const userMenuRef = useRef(null);

  const settingHandlers: SettingHandlersProps = {
    modalOpenHandler: () => {
      setState((prev) => ({ ...prev, isOpen: true }));
    },

    modalCloseHandler: () => {
      setState((prev) => ({ ...prev, isOpen: false }));
    },
  };

  const manageHandlers: ManageHandlersProps = {
    modalManageOpenHandler: () => {
      setState((prev) => ({ ...prev, isOpenManage: true }));
    },
    modalManageCloseHandler: () => {
      setState((prev) => ({ ...prev, isOpenManage: false }));
    },
  };

  const setTypeHandlers: TypeHandlersProps = {
    modalType: () => {
      setState((prev) => ({ ...prev, type: 1 }));
    },
  };

  const handleCloseModalManage = () => {
    manageHandlers.modalManageCloseHandler();
    settingHandlers.modalOpenHandler();
    setState((prev) => ({ ...prev, type: 0 }));
  };

  return (
    <>
      <SettingModal
        setTypeHandlers={setTypeHandlers}
        manageHandlers={manageHandlers}
        settingHandlers={settingHandlers}
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

      <ManageModal
        open={state.isOpenManage}
        type={state.type}
        closeIcon={<CloseOutlined className={cx("btnClose")} />}
        onCancel={handleCloseModalManage}
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
