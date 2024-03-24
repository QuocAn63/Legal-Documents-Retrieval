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
import { useEffect, useRef, useState } from "react";
import { ChatService } from "../services/chat.service";
import { IConversation } from "../interfaces/chat.tsx";
import ShareModal from "./modals/share.tsx";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { conversationTitleValidate } from "../helpers/validates.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";

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
  const [state, setState] = useState<SidebarItemStateProps>({
    edit: { isEditing: false, value: "" },
  });
  const renameInputRef = useRef<InputRef>(null);

  const onSubmit: SubmitHandler<IChangeConversationTitleInput> = async (
    data
  ) => {
    console.log(data);
  };

  const initEvents = () => {
    if (renameInputRef.current?.input) {
      const { input } = renameInputRef.current;

      input.addEventListener("focus", bindFocusEventOnInput);
      window.addEventListener("click", () =>
        setState((prev) => ({
          ...prev,
          edit: { ...prev.edit, isEditing: false },
        }))
      );
    }
  };

  const bindFocusEventOnInput = (event: FocusEvent) => {
    event.stopPropagation();
  };

  const handleClickBtnRename = () => {
    setValue("title", title);
    initEvents();
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
              <Input ref={renameInputRef}></Input>
            </FormItem>
          </Form>
        ) : (
          <>
            <CustomLink to={`/c/${conversationID}`} className={cx("link")}>
              {title}
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
      <ShareModal open={isOpen} onCancel={handleClose} />
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

export default function Sidebar() {
  const [state, setState] = useState<SidebarStateProps>({
    conversations: [],
    shareModal: {
      isOpen: false,
      handleOpen: () => {},
      handleClose: () => {},
    },
    selectedConversation: undefined,
  });

  useEffect(() => {
    const getInitialData = async () => {
      const conversationsData = await ChatService.getList_Conversations({});

      setState((prev) => ({
        ...prev,
        conversations: conversationsData.data || [],
        shareModal: {
          ...prev.shareModal,
          handleOpen: handleClickOpenShareModal,
          handleClose: handleClickCloseShareModal,
        },
      }));
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
      <div className={cx("wrapper")}>
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <NewChatItem />
          <SidebarItemContainer
            items={state.conversations}
            shareModalState={state.shareModal}
          />
        </Space>
        <UserMenu />
      </div>
    </>
  );
}
