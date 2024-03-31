import { Dropdown, Flex, Image, Modal, ModalProps, Space } from "antd";
import { memo, ReactNode, useEffect } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { logOutRedux } from "../redux/user";

// Manage Modal ( Archive and Share Modal)
import ManageModal from "./modals/manage.tsx";
import { ChatService } from "../services/chat.service.tsx";
import { RootState } from "../redux/store.tsx";
import { IConversation } from "../interfaces/chat.tsx";
import SharedService from "../services/shared.service.tsx";
import { ISharedConversation1 } from "../interfaces/shared.tsx";

const { Text } = Typography;
const cx = classNames.bind(styles);

interface SettingHandlersProps {
  modalOpenHandler: () => void;
  modalCloseHandler: () => void;
}

interface ManageHandlersProps {
  modalManageOpenHandler: () => void;
  modalManageCloseHandler: () => void;
  getList_Archived: () => Promise<void>;
  getList_Shared: () => Promise<void>;
  handleDeleteAll: () => void;

  handleDelete: (indexToDel: number) => void;
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
  const { modalManageOpenHandler, getList_Archived, getList_Shared } =
    manageHandlers;
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
                  getList_Archived();
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
                  getList_Shared();
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

interface IUserMenu {
  isOpen: boolean;
  isOpenManage: boolean;
  type: number;
  manage: (IConversation | ISharedConversation1)[];
  isLoading: boolean;
}

const UserMenu = memo(() => {
  const token = useSelector((state: RootState) => state.user.user?.token);

  const [state, setState] = useState<IUserMenu>({
    isOpen: false,
    isOpenManage: false,
    type: 0,
    manage: [],
    isLoading: false,
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
    getList_Archived: async () => {
      try {
        if (state.manage.length <= 0) {
          setState((prev) => ({ ...prev, isLoading: true }));
        }
        const listArchived = await ChatService.getList_archived_Conversations(
          token as string
        );
        if (listArchived.status === 200) {
          setState((prev) => ({
            ...prev,
            manage: listArchived.data || [],
            isLoading: false,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    },
    getList_Shared: async () => {
      try {
        if (state.manage.length <= 0) {
          setState((prev) => ({ ...prev, isLoading: true }));
        }

        const listShared = await SharedService.getList_shared(token as string);
        if (listShared.status === 200) {
          setState((prev) => ({
            ...prev,
            manage: listShared.data || [],
            isLoading: false,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleDeleteAll: () => {
      console.log("Delete all");

      setState((prev) => ({
        ...prev,
        manage: [],
      }));
    },
    handleDelete: (indexToDel: number) => {
      const newData = state.manage.filter((_, index) => index !== indexToDel);
      setState((prev) => ({
        ...prev,
        manage: newData,
      }));
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
        manage={state.manage}
        isLoading={state.isLoading}
        manageHandlers={manageHandlers}
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
});

export default UserMenu;
