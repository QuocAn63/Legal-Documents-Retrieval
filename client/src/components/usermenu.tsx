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
import { ISharedConversation2 } from "../interfaces/shared.tsx";
import useAxios from "../hooks/axios.tsx";
import { useNavigate } from "react-router-dom";
import useMessage from "antd/es/message/useMessage";
import { ShowMessagesFromError } from "../helpers/showErrorMessage.tsx";
import AuthService from "../services/auth.service.tsx";
import Paragraph from "antd/es/typography/Paragraph";

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

type SettingModalState = {
  selectedItem: number;
  confirmModal: "USERS" | "CONVERSATIONS" | "";
};

const SettingModal = ({
  setTypeHandlers,
  settingHandlers,
  manageHandlers,
  ...props
}: SettingModalProps) => {
  const [api, contextHolder] = useMessage();
  const { modalManageOpenHandler, getList_Archived, getList_Shared } =
    manageHandlers;
  const { modalCloseHandler } = settingHandlers;
  const { modalType } = setTypeHandlers;
  const [state, setState] = useState<SettingModalState>({
    confirmModal: "",
    selectedItem: 0,
  });
  const { instance } = useAxios();
  const chatService = new ChatService(instance);
  const authService = new AuthService(instance);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleSelectItem = (index: number) => {
    setState((prev) => ({ ...prev, selectedItem: index }));
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await authService.deleteAccount();

      if (response.status === 200) {
        api.success(response.message);
        dispatch(logOutRedux());
      }
    } catch (err) {
      ShowMessagesFromError(err, api);
    }
  };

  const handleDeleteConversations = async () => {
    try {
      const response = await chatService.deleteAll_Conversations();

      if (response.status === 200) {
        navigate("/", { replace: true });
        api.success(response.message);
      }
    } catch (err) {
      ShowMessagesFromError(err, api);
    }
  };

  const handleOk = async () => {
    if (state.confirmModal === "USERS") {
      await handleDeleteAccount();
    } else {
      await handleDeleteConversations();
    }

    setState((prev) => ({ ...prev, confirmModal: "" }));
  };

  return (
    <>
      <Modal
        zIndex={999}
        open={state.confirmModal !== ""}
        okText="Đồng ý"
        styles={{
          content: {
            backgroundColor: "#2F2F2F",
          },
        }}
        footer={null}
        closeIcon={<CloseOutlined style={{ color: "#fff" }} />}
        onCancel={() => setState((prev) => ({ ...prev, confirmModal: "" }))}
      >
        <Paragraph style={{ color: "#fff" }}>
          {state.confirmModal === "USERS"
            ? "Xóa vĩnh viễn tài khoản?"
            : "Xóa tất cả cuộc hội thoại?"}
        </Paragraph>
        <Flex justify="flex-end" gap={20}>
          <CustomButton onClick={handleOk} outlined>
            Đồng ý
          </CustomButton>
        </Flex>
      </Modal>
      {contextHolder}
      <Modal {...props} width={680} zIndex={500}>
        <div className={cx("modalWrapper")}>
          <Title level={4} className={cx("title")}>
            Cài đặt
          </Title>
          <span className="horizontal"></span>

          <div style={{ display: "flex" }}>
            <div className={cx("btnContainerLeft")}>
              <CustomButton
                selected={state.selectedItem === 0}
                icon={<SettingOutlined />}
                className={cx("btn")}
                onClick={() => handleSelectItem(0)}
              >
                Cài đặt chung
              </CustomButton>

              <CustomButton
                selected={state.selectedItem === 1}
                icon={<DatabaseOutlined />}
                className={cx("btn")}
                onClick={() => handleSelectItem(1)}
              >
                Dữ liệu
              </CustomButton>
            </div>
            <div className={cx("btnContainer")}>
              {state.selectedItem === 0 && (
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
                      <CustomButton
                        outlined
                        status="important"
                        background
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            confirmModal: "CONVERSATIONS",
                          }))
                        }
                      >
                        Xóa tất cả
                      </CustomButton>
                    }
                  />
                </>
              )}
              {state.selectedItem === 1 && (
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
                      <CustomButton
                        outlined
                        status="important"
                        background
                        onClick={() =>
                          setState((prev) => ({
                            ...prev,
                            confirmModal: "USERS",
                          }))
                        }
                      >
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
    </>
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

interface StateProps {
  isOpen: boolean;
  isOpenManage: boolean;
  type: number;
  archived: IConversation[];
  shared: ISharedConversation2[];
  isLoading: boolean;
  firstCall: boolean;
}

type UserMenuProps = {
  loadData: (data?: any) => Promise<void>;
};

const UserMenu = memo(({ loadData }: UserMenuProps) => {
  const { instance } = useAxios();
  const chatService = new ChatService(instance);
  const sharedService = new SharedService(instance);
  const [state, setState] = useState<StateProps>({
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
        setState((prev) => ({ ...prev, isLoading: true }));

        const listArchived = await chatService.getList_archived_Conversations();

        if (listArchived.status === 200) {
          setState((prev) => ({
            ...prev,
            archived: listArchived.data || [],
            isLoading: false,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    },
    getList_Shared: async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));

        const listShared = await sharedService.getList_shared();
        if (listShared.status === 200) {
          setState((prev) => ({
            ...prev,
            shared: listShared.data || [],
            isLoading: false,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    },
  };

  const manageFunction = {
    handleDelete: async (IDs: string[], type: number) => {
      let response;
      if (type === 0) {
        response = await chatService.delete_Conversations(IDs);
      } else {
        response = await sharedService.delete_shared(IDs);
      }

      if (response.status === 200) {
        await loadData();
        const newData =
          type === 0
            ? state.archived.filter((record) => !IDs.includes(record.id))
            : state.shared.filter((record) => !IDs.includes(record.id));

        if (type === 0) {
          setState((prev) => ({
            ...prev,
            archived: newData as IConversation[],
          }));
        } else {
          setState((prev) => ({
            ...prev,
            shared: newData as ISharedConversation2[],
          }));
        }
      }
    },
    handleUnarchive: async (id: string) => {
      const response = await chatService.unarchive_Conversations(id);

      if (response.status === 200) {
        setState((prev) => ({
          ...prev,
          archived: prev.archived.filter((item) => item.id !== id),
        }));
        await loadData();
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
