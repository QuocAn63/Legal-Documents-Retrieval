import { Dropdown, Flex, Image, Modal, ModalProps, Space } from "antd";
import { memo, ReactNode } from "react";
import CustomButton from "./button";
import styles from "../styles/usermenu.module.scss";
import classNames from "classnames/bind";
import {
  CloseOutlined,
  DatabaseOutlined,
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
}

interface SettingModalProps extends ModalProps {
  manageHandlers: ManageHandlersProps;
  settingHandlers: SettingHandlersProps;
  setTypeHandlers: TypeHandlersProps;
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
  modalType: (type: number) => void;
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

  const [selectItem, setSelectItem] = useState<number>(0);

  const handleSelectItem = (index: number) => {
    setSelectItem(index);
  };

  return (
    <Modal {...props} width={680}>
      <div className={cx("modalWrapper")}>
        <Title level={4} className={cx("title")}>
          Cài đặt
        </Title>
        <span className="horizontal"></span>

        <div style={{ display: "flex" }}>
          <div className={cx("btnContainerLeft")}>
            <CustomButton
              selected={selectItem === 0}
              icon={<SettingOutlined />}
              className={cx("btn")}
              onClick={() => handleSelectItem(0)}
            >
              Cài đặt chung
            </CustomButton>

            <CustomButton
              selected={selectItem === 1}
              icon={<DatabaseOutlined />}
              className={cx("btn")}
              onClick={() => handleSelectItem(1)}
            >
              Dữ liệu
            </CustomButton>
          </div>
          <div className={cx("btnContainer")}>
            {selectItem === 0 && (
              <>
                <SettingModalItem
                  title="Các hội thoại đã lưu"
                  button={
                    <CustomButton
                      outlined
                      onClick={() => {
                        modalCloseHandler();
                        modalManageOpenHandler();
                        modalType(0);
                        getList_Archived();
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
              </>
            )}
            {selectItem === 1 && (
              <>
                <SettingModalItem
                  title="Các liên kết đã chia sẻ"
                  button={
                    <CustomButton
                      outlined
                      onClick={() => {
                        modalCloseHandler();
                        modalManageOpenHandler();
                        modalType(1);
                        getList_Shared();
                      }}
                    >
                      Quản lý
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
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const MenuSelections = ({ settingHandlers }: MenuSelectionsProps) => {
  const { modalOpenHandler } = settingHandlers;

  const dispatch = useDispatch();
  const type = useSelector((state: RootState) => state.user?.user?.token);
  const handleLogOut = () => {
    if (type === "Google") {
      // googleLogout();
    }
    dispatch(logOutRedux());
  };

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
  archived: IConversation[];
  shared: ISharedConversation1[];
  isLoading: boolean;
  firstCall: boolean;
}

const UserMenu = memo(() => {
  const token = useSelector((state: RootState) => state.user.user.token);
  const chatService = new ChatService(token);
  const sharedService = new SharedService(token);
  const [state, setState] = useState<IUserMenu>({
    isOpen: false,
    isOpenManage: false,
    type: 0,
    archived: [],
    shared: [],
    firstCall: false,
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
        if (state.archived.length <= 0 && !state.isLoading) {
          setState((prev) => ({ ...prev, isLoading: true }));
        }
        if (state.archived.length <= 0) {
          const listArchived =
            await chatService.getList_archived_Conversations();
          if (listArchived.status === 200) {
            setState((prev) => ({
              ...prev,
              archived: listArchived.data || [],
              isLoading: false,
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    getList_Shared: async () => {
      try {
        if (state.shared.length <= 0 && !state.isLoading) {
          setState((prev) => ({ ...prev, isLoading: true }));
        }

        if (state.shared.length <= 0) {
          const listShared = await sharedService.getList_shared();
          if (listShared.status === 200) {
            setState((prev) => ({
              ...prev,
              shared: listShared.data || [],
              isLoading: false,
            }));
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
  };

  const manageFunction = {
    handleDeleteAll: (type: number) => {
      setState((prev) => ({
        ...prev,
        archived: type === 0 ? [] : prev.archived,
        shared: type === 1 ? [] : prev.shared,
      }));
    },
    handleDelete: (indexToDel: number, type: number) => {
      const newData =
        type === 0
          ? state.archived.filter((_, index) => index !== indexToDel)
          : state.shared.filter((_, index) => index !== indexToDel);

      if (type === 0) {
        setState((prev) => ({
          ...prev,
          archived: newData as IConversation[],
        }));
      } else {
        setState((prev) => ({
          ...prev,
          shared: newData as ISharedConversation1[],
        }));
      }
    },
  };

  const setTypeHandlers: TypeHandlersProps = {
    modalType: (type: number) => {
      setState((prev) => ({ ...prev, type: type }));
    },
  };

  const handleCloseModalManage = () => {
    manageHandlers.modalManageCloseHandler();
    settingHandlers.modalOpenHandler();
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
        manage={state.type === 0 ? state.archived : state.shared}
        isLoading={state.isLoading}
        manageHandlers={manageFunction}
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
              // src="/default-avatar.png"
              src={"/default-avatar.png"}
              preview={false}
              width={40}
              height={40}
              className={cx("avatarHolder")}
            />
            <span className={cx("username")}>Hello</span>
          </Space>
        </div>
      </Dropdown>
    </>
  );
});

export default UserMenu;
