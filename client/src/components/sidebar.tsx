import styles from "../styles/sidebar.module.scss";
import classNames from "classnames/bind";
import { Dropdown, Form, Input, InputRef, Space, Tooltip } from "antd";
import CustomLink from "../components/link.tsx";
import CustomButton from "./button.tsx";
import {
  ContainerOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  UploadOutlined,
  WechatFilled,
} from "@ant-design/icons";
import { useParams } from "react-router-dom";
import UserMenu from "./usermenu";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { ChatService } from "../services/chat.service";
import { IConversation } from "../interfaces/chat.tsx";
import ShareModal from "./modals/share.tsx";
import ArchivedModal from "./modals/archived.tsx";

import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { conversationTitleValidate } from "../helpers/validates.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";

// Import Redux
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store.tsx";
import {
  getConversationRedux,
  renameTitleRedux,
} from "../redux/conversations.tsx";

const cx = classNames.bind(styles);

interface SidebarItemProps extends IConversation {
  isSelected?: boolean;
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
}

interface DropdownMenuProps {
  conversationID: string;
  onClickBtnShare: (data: any) => void;
  onClickBtnRename: (data: any) => void;
}

interface ModalControlsProps {
  isOpen: boolean;
  handleOpen: (data: any) => void;
  handleClose: (data: any) => void;
}

interface IChangeConversationTitleInput {
  title: string;
}

const schema = z.object({
  title: conversationTitleValidate,
});

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  onClickBtnShare,
  onClickBtnRename,
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
        icon={<EditOutlined />}
        onClick={onClickBtnRename}
      >
        Đổi tên
      </CustomButton>
      <CustomButton
        className={cx("btn")}
        icon={<DeleteOutlined />}
        status="important"
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
  conversationID,
  isSelected = false,
  shareModalState,
}: SidebarItemProps) => {
  const { handleClose, handleOpen, isOpen } = shareModalState;
  const { control, handleSubmit, setValue } =
    useForm<IChangeConversationTitleInput>({
      resolver: zodResolver(schema),
    });

  // get Conversation from redux
  const dispatch = useDispatch();

  const [state, setState] = useState<SidebarItemStateProps>({
    edit: { isEditing: false, value: "" },
  });
  const renameInputRef = useRef<InputRef>(null);

  const onSubmit: SubmitHandler<IChangeConversationTitleInput> = async (
    data
  ) => {
    // Handle rename

    const payload = {
      conversationID: conversationID,
      title: data.title,
    };

    // sửa lại rename = useState

    // const renameConversation = await ChatService.update_Conversations(payload);
    // if (renameConversation.status === 200) {
    //   renameTitle((prev) => ({
    //     ...prev,
    //     conversations: prev.conversations.map((item) => {
    //       if (item.conversationID === conversationID) {
    //         return {
    //           ...item,
    //           title: data.title,
    //         };
    //       }
    //       return item;
    //     }),
    //   }));
    // }

    dispatch(renameTitleRedux(payload));
    setState((prev) => ({
      ...prev,
      edit: { ...prev.edit, isEditing: false },
    }));
  };

  // Khi input không còn focus thì sẽ thoát khỏi trại thái isEditing
  const handleBlur = () => {
    setState((prev) => ({
      ...prev,
      edit: { ...prev.edit, isEditing: false },
    }));
  };

  const handleClickBtnRename = () => {
    setValue("title", title);
    setState((prev) => ({
      ...prev,
      edit: { ...prev.edit, isEditing: true },
    }));
  };

  return (
    <>
      <div className={cx("item", { selected: isSelected })} id={conversationID}>
        {state.edit.isEditing ? (
          <Form onFinish={handleSubmit(onSubmit)}>
            <FormItem control={control} name="title">
              <Input ref={renameInputRef} autoFocus onBlur={handleBlur} />
            </FormItem>
          </Form>
        ) : (
          <>
            <CustomLink to={`/c/${conversationID}`} className={cx("link")}>
              {title.length > 30 ? title.substring(0, 30) + "..." : title}
            </CustomLink>
            <Space className={cx("btnContainer")}>
              <Dropdown
                trigger={["click"]}
                dropdownRender={() => (
                  <DropdownMenu
                    conversationID={conversationID}
                    onClickBtnShare={() => handleOpen(conversationID)}
                    onClickBtnRename={handleClickBtnRename}
                  ></DropdownMenu>
                )}
              >
                <Tooltip title="Thêm">
                  <MoreOutlined className={cx("btn")} />
                </Tooltip>
              </Dropdown>
              <Tooltip title="Lưu">
                <ContainerOutlined className={cx("btn")} />
              </Tooltip>
            </Space>
          </>
        )}
      </div>
      {/* <ShareModal open={isOpen} onCancel={handleClose} /> */}
      <ArchivedModal open={isOpen} onCancel={handleClose} />
    </>
  );
};

const SidebarItemContainer = ({
  shareModalState,
  items,
}: SidebarItemContainerProps) => {
  const { conversationID } = useParams();

  return (
    <div className={cx("itemContainer")}>
      {items.map((item) => (
        <SidebarItem
          {...item}
          key={item.conversationID}
          shareModalState={shareModalState}
          isSelected={item.conversationID === conversationID}
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

  const dispatch = useDispatch();

  useEffect(() => {
    const getInitialData = async () => {
      const conversationsData = await ChatService.getList_Conversations({});
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
  }, []);

  const handleClickOpenShareModal = (conversationID: string) => {
    setState((prev) => ({
      ...prev,
      shareModal: { ...prev.shareModal, isOpen: true },
      selectedConversation: state.conversations.find(
        (value) => value.conversationID === conversationID
      ),
    }));
  };

  const handleClickCloseShareModal = () => {
    setState((prev) => ({
      ...prev,
      shareModal: { ...prev.shareModal, isOpen: false },
    }));
  };

  return (
    <>
      {conversation.length > 0 && (
        <div className={cx("wrapper")}>
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            <NewChatItem />
            <SidebarItemContainer
              // items={state.conversations}
              // Truyền conversation từ redux vào Components
              items={conversation}
              shareModalState={state.shareModal}
            />
          </Space>
          <UserMenu />
        </div>
      )}
    </>
  );
});
export default Sidebar;
