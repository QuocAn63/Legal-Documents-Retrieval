import styles from "../styles/sidebar.module.scss";
import classNames from "classnames/bind";
import { Dropdown, Space, Tooltip } from "antd";
import CustomLink from "../components/link.tsx";
import CustomButton from "./button.tsx";
import {
  ContainerOutlined,
  DeleteOutlined,
  MoreOutlined,
  UploadOutlined,
  WechatFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import UserMenu from "./usermenu";
import React, { FC, memo, useEffect, useState } from "react";
import { ChatService } from "../services/chat.service";
import { IConversation } from "../interfaces/chat.tsx";
import ShareModal from "./modals/share.tsx";

import useAxios from "../hooks/axios.tsx";

const cx = classNames.bind(styles);

interface SidebarItemProps extends IConversation {
  isSelected?: boolean;
  handleDelete: (data: any) => void;
  shareModalState: ModalControlsProps;
  handleArchive: (data: any) => void;
}

interface SidebarStateProps {
  conversations: IConversation[];
  shareModal: ModalControlsProps;
  selectedConversation?: IConversation;
}

interface SidebarItemContainerProps {
  items: IConversation[];
  shareModalState: ModalControlsProps;
  handleDelete: (data: any) => void;
  handleArchive: (data: any) => void;
}

interface DropdownMenuProps {
  conversationID: string;
  onClickBtnShare: (data: any) => void;
  onClickBtnDelete: (data: any) => void;
}

interface ModalControlsProps {
  handleOpen: (data: any) => void;
  handleClose: (data: any) => void;
  selectedID: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onClickBtnShare,
  onClickBtnDelete,
}) => {
  return (
    <div className={cx("btnMoreWrapper")}>
      <CustomButton
        className={cx("btn")}
        icon={<UploadOutlined />}
        onClick={onClickBtnShare}
      >
        Chia sẻ
      </CustomButton>
      <CustomButton
        className={cx("btn")}
        icon={<DeleteOutlined />}
        status="important"
        onClick={onClickBtnDelete}
      >
        Xóa
      </CustomButton>
    </div>
  );
};

const NewChatItem = () => {
  return (
    <div className={cx("itemContainer")}>
      <div className={cx("item", "btnNewChat")}>
        <CustomLink to="/" className={cx("link")}>
          Cuộc hội thoại mới
        </CustomLink>
        <Space className={cx("btnContainer")}>
          <Tooltip title="Tạo cuộc hội thoại mới">
            <WechatFilled className={cx("btn")} />
          </Tooltip>
        </Space>
      </div>
    </div>
  );
};

const SidebarItem = ({
  title,
  id,
  isSelected = false,
  handleDelete,
  handleArchive,
  shareModalState,
}: SidebarItemProps) => {
  const { handleOpen } = shareModalState;

  return (
    <>
      <div className={cx("item", { selected: isSelected })} id={id}>
        <>
          <CustomLink to={`/c/${id}`} className={cx("link")}>
            {title.length > 50 ? title.substring(0, 50) + "..." : title}
          </CustomLink>
          <Space className={cx("btnContainer")}>
            <Dropdown
              trigger={["click"]}
              dropdownRender={() => (
                <DropdownMenu
                  conversationID={id}
                  onClickBtnShare={() => handleOpen(id)}
                  onClickBtnDelete={() => handleDelete(id)}
                ></DropdownMenu>
              )}
            >
              <Tooltip title="Thêm">
                <MoreOutlined className={cx("btn")} />
              </Tooltip>
            </Dropdown>
            <Tooltip title="Lưu trữ">
              <ContainerOutlined
                className={cx("btn")}
                onClick={handleArchive}
              />
            </Tooltip>
          </Space>
        </>
      </div>
    </>
  );
};

const SidebarItemContainer = ({
  shareModalState,
  items,
  handleDelete,
  handleArchive,
}: SidebarItemContainerProps) => {
  const { conversationID } = useParams();

  return (
    <div className={cx("itemContainer")}>
      {items.map((item) => (
        <SidebarItem
          {...item}
          handleArchive={() => handleArchive(item.id)}
          key={item.id}
          shareModalState={shareModalState}
          isSelected={item.id === conversationID}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
};

// Thêm memo
const Sidebar: FC = memo(() => {
  const [state, setState] = useState<SidebarStateProps>({
    conversations: [],
    shareModal: {
      handleOpen: () => {},
      handleClose: () => {},
      selectedID: "",
    },
    selectedConversation: undefined,
  });

  const { instance } = useAxios();
  const chatService = new ChatService(instance);
  const navigate = useNavigate();
  const location = useLocation();
  const { conversationID } = useParams();
  const getInitialData = async () => {
    const conversationsData = await chatService.getList_Conversations({});

    if (conversationsData.status === 200) {
      setState((prev) => ({
        ...prev,
        shareModal: {
          ...prev.shareModal,
          handleOpen: handleClickOpenShareModal,
          handleClose: handleClickCloseShareModal,
        },
        conversations: conversationsData.data || [],
      }));
    }
  };

  useEffect(() => {
    getInitialData();
  }, [location.pathname]);

  const handleClickOpenShareModal = (conversationID: string) => {
    setState((prev) => ({
      ...prev,
      shareModal: { ...prev.shareModal, selectedID: conversationID },
      selectedConversation: state.conversations.find(
        (value) => value.id === conversationID
      ),
    }));
  };

  const handleClickCloseShareModal = () => {
    setState((prev) => ({
      ...prev,
      shareModal: { ...prev.shareModal, selectedID: "" },
    }));
  };

  const handleClickDelete = async (id: string) => {
    const response = await chatService.delete_Conversations([id]);

    if (response.status === 200 && conversationID === id) {
      navigate("/");
    } else {
      await getInitialData();
    }
  };

  const handleClickArchive = async (conversationID: string) => {
    const response = await chatService.archive_Conversations(conversationID);

    if (response.status === 200) {
      const newConvs = state.conversations.filter(
        (conv) => conversationID !== conv.id
      );
      setState((prev) => ({
        ...prev,
        conversations: newConvs,
      }));
    }
  };

  console.log(state.shareModal);

  return (
    <>
      <div className={cx("wrapper")}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <NewChatItem />
          <SidebarItemContainer
            handleArchive={handleClickArchive}
            handleDelete={handleClickDelete}
            items={state.conversations}
            shareModalState={state.shareModal}
          />
        </Space>
        <ShareModal
          open={state.shareModal.selectedID !== ""}
          onCancel={handleClickCloseShareModal}
          conversationID={state.shareModal.selectedID}
        />
        <UserMenu loadData={getInitialData} />
      </div>
    </>
  );
});
export default Sidebar;
