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
// Import Redux
import { useDispatch, useSelector } from "react-redux";

import ShareModal from "./modals/share.tsx";

import { RootState } from "../redux/store.tsx";
import { getConversationRedux } from "../redux/conversations.tsx";

const cx = classNames.bind(styles);

interface SidebarItemProps extends IConversation {
  isSelected?: boolean;
  handleDelete: (data: any) => void;
  shareModalState: ModalControlsProps;
}

type SidebarItemStateProps = {
  edit: {
    isEditing: boolean;
    value: string;
  };
};

interface SidebarStateProps {
  conversations: IConversation[];
  shareModal: ModalControlsProps;
  selectedConversation?: IConversation;
}

interface SidebarItemContainerProps {
  items: IConversation[];
  shareModalState: ModalControlsProps;
  handleDelete: (data: any) => void;
}

interface DropdownMenuProps {
  conversationID: string;
  onClickBtnShare: (data: any) => void;
  onClickBtnDelete: (data: any) => void;
}

interface ModalControlsProps {
  isOpen: boolean;
  handleOpen: (data: any) => void;
  handleClose: (data: any) => void;
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
  shareModalState,
}: SidebarItemProps) => {
  const { handleClose, handleOpen, isOpen } = shareModalState;

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
              <ContainerOutlined className={cx("btn")} />
            </Tooltip>
          </Space>
        </>
      </div>
      <ShareModal open={isOpen} onCancel={handleClose} conversationID={id} />
    </>
  );
};

const SidebarItemContainer = ({
  shareModalState,
  items,
  handleDelete,
}: SidebarItemContainerProps) => {
  const { conversationID } = useParams();

  return (
    <div className={cx("itemContainer")}>
      {items.map((item) => (
        <SidebarItem
          {...item}
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
      isOpen: false,
      handleOpen: () => {},
      handleClose: () => {},
    },
    selectedConversation: undefined,
  });
  // get Conversation from redux
  const conversation = useSelector(
    (state: RootState) => state.conversation.conversations
  );
  const token = useSelector((state: RootState) => state.user.user?.token) || "";
  const chatService = new ChatService(token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getInitialData = async () => {
      const conversationsData = await chatService.getList_Conversations({});
      if (conversationsData) {
        // Lưu conversation vào redux store conversations
        dispatch(getConversationRedux(conversationsData.data));

        setState((prev) => ({
          ...prev,
          // conversations: conversationsData.data || [],
          shareModal: {
            ...prev.shareModal,
            handleOpen: handleClickOpenShareModal,
            handleClose: handleClickCloseShareModal,
          },
        }));
      }
      // }
    };

    getInitialData();
  }, [location.pathname]);

  const handleClickOpenShareModal = (conversationID: string) => {
    setState((prev) => ({
      ...prev,
      shareModal: { ...prev.shareModal, isOpen: true },
      selectedConversation: state.conversations.find(
        (value) => value.id === conversationID
      ),
    }));
  };

  const handleClickCloseShareModal = () => {
    setState((prev) => ({
      ...prev,
      shareModal: { ...prev.shareModal, isOpen: false },
    }));
  };

  const handleClickDelete = async (conversationID: string) => {
    const response = await chatService.delete_Conversations([conversationID]);

    if (response.status === 200 && conversationID === conversationID) {
      navigate("/");
    }
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <NewChatItem />
          <SidebarItemContainer
            handleDelete={handleClickDelete}
            items={conversation}
            shareModalState={state.shareModal}
          />
        </Space>
        <UserMenu />
      </div>
    </>
  );
});
export default Sidebar;
