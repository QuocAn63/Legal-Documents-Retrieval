import {
  Modal,
  ModalProps,
  Flex,
  Row,
  Col,
  Tooltip,
  Pagination,
  PaginationProps,
  ConfigProvider,
  Spin,
} from "antd";
import {
  CloseOutlined,
  ContainerOutlined,
  DeleteOutlined,
  ShareAltOutlined,
} from "@ant-design/icons";
import styles from "../../styles/modal.module.scss";
import classNames from "classnames/bind";
import Typography from "antd/es/typography";
import { useEffect, useState } from "react";
import CustomButton from "../button";
import { IConversation } from "../../interfaces/chat";
import { ISharedConversation2 } from "../../interfaces/shared";
import { Link } from "react-router-dom";

const { Title } = Typography;

const cx = classNames.bind(styles);

interface ManageHandlersProps {
  handleDelete: (IDs: string[], type: number) => void;
  handleUnarchive?: (id: string) => void;
}

interface ShareModalProps extends ModalProps {
  type: number;
  manage: (IConversation | ISharedConversation2)[];
  manageHandlers: ManageHandlersProps;
  isLoading: boolean;
  onCancel: () => void;
}

interface ShareModalStateProps {
  totalPage: number;
  currentIndex: number;
  currentPage: number;
}

const renderContent = (
  item: IConversation | ISharedConversation2,
  type: number,
  manageHandlers: ManageHandlersProps
) => {
  return (
    <Col style={{ gap: 10, padding: "5px 0 5px 0" }} key={item.id}>
      <Row>
        <Flex align="center" style={{ paddingRight: "24px", width: "50%" }}>
          <a
            style={{
              fontWeight: "400",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "90%",
            }}
            target="_blank"
            href={
              "sharedCode" in item ? `/s/${item.sharedCode}` : `/c/${item.id}`
            }
          >
            {"title" in item ? item.title : item.conversation.title}
          </a>
        </Flex>
        <Flex flex="0 0 50%" align="center">
          <Flex flex="0 0 50%">
            <span className={cx("titleMain")}>{item.createdAt}</span>
          </Flex>
          <Flex flex="0 0 50%" justify="end">
            {"conversationID" in item ? (
              <Link to={`/c/${item.conversationID}`} target="_blank">
                <Tooltip title="Xem nguồn">
                  <ShareAltOutlined className={cx("icon")} />
                </Tooltip>
              </Link>
            ) : (
              <Tooltip title="Bỏ lưu trữ">
                <ContainerOutlined
                  className={cx("icon")}
                  onClick={() =>
                    manageHandlers.handleUnarchive
                      ? manageHandlers.handleUnarchive(item.id)
                      : undefined
                  }
                />
              </Tooltip>
            )}
            <Tooltip title="Xóa">
              <DeleteOutlined
                className={cx("icon")}
                onClick={() => manageHandlers.handleDelete([item.id], type)}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Row>
      <span className="horizontal"></span>
    </Col>
  );
};

// Constant
const TOTAL_ITEM_PAGE = 5;

export default function ManageModal({
  type,
  manage,
  manageHandlers,
  isLoading,
  onCancel,
  ...props
}: ShareModalProps) {
  const [state, setState] = useState<ShareModalStateProps>({
    totalPage: 1,
    currentIndex: 0,
    currentPage: 1,
  });

  useEffect(() => {
    const totalPage = Math.ceil(manage.length / TOTAL_ITEM_PAGE) * 10;
    setState((prev) => ({ ...prev, totalPage: totalPage }));
  }, [manage.length, manage, type]);

  const resetDefault = () => {
    setState((prev) => ({
      ...prev,
      currentIndex: 0,
      currentPage: 1,
    }));
  };

  const handleCancelModal = () => {
    resetDefault();
    onCancel();
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    const newStartIndex = (pageNumber - 1) * TOTAL_ITEM_PAGE;

    setState((prev) => ({
      ...prev,
      currentIndex: newStartIndex,
      currentPage: newStartIndex / 4 + 1,
    }));
  };

  return (
    <Modal
      styles={{
        content: {
          flex: 1,
          backgroundColor: "#2F2F2F",
          minHeight: "450px",
        },
      }}
      width={800}
      footer={null}
      className={cx("wrapper")}
      onCancel={handleCancelModal}
      closeIcon={<CloseOutlined className={cx("btnClose")} />}
      {...props}
    >
      <Title
        level={5}
        className={cx("titleMain")}
        style={{ padding: "0 0 12px 0", fontSize: "20px" }}
      >
        {type === 0 ? "Cuộc trò chuyện đã lưu" : "Các liên kết được chia sẽ"}
      </Title>
      <span className="horizontal"></span>

      <Row>
        <Flex align="center" style={{ paddingRight: "24px", width: "50%" }}>
          <span className={cx("titleMain")}>Tên</span>
        </Flex>
        <Flex flex={1}>
          <Flex flex={1} align="center">
            <span className={cx("titleMain")}>Ngày</span>
          </Flex>
          {type === 1 ? (
            <Flex flex={1} justify="end" align="center">
              <CustomButton
                status={"important"}
                onClick={() => {
                  manageHandlers.handleDelete(
                    manage.map((item) => item.id),
                    type
                  );
                  setState((prev) => ({ ...prev, isLoading: false }));
                }}
              >
                Xóa tất cả
              </CustomButton>
            </Flex>
          ) : null}
        </Flex>
      </Row>
      <span className="horizontal"></span>
      {manage.length > 0 &&
        !isLoading &&
        manage
          .slice(state.currentIndex, state.currentIndex + TOTAL_ITEM_PAGE)
          .map((item) => renderContent(item, type, manageHandlers))}
      {isLoading && (
        <Flex justify="center">
          <Spin />
        </Flex>
      )}

      {manage.length > 0 && (
        <div
          style={{
            bottom: 0,
            position: "absolute",
            transform: "translateX(-50%)",
            width: "100%",
            left: "50%",
          }}
        >
          <Flex
            justify="center"
            align="center"
            style={{
              padding: 20,
              bottom: 0,
            }}
          >
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "rgb(66, 66, 66)",
                  colorPrimaryHover: "white",
                  colorPrimaryBorder: "rgb(66, 66, 66)",
                  colorBgTextHover: "rgb(66, 66, 66)",
                },
                components: {
                  Pagination: {
                    itemActiveBg: "rgb(66, 66, 66)",
                    itemActiveColorDisabled: "white",
                  },
                },
              }}
            >
              <Pagination
                className={cx("page")}
                defaultCurrent={1}
                total={state.totalPage}
                onChange={onChangePage}
                showLessItems={true}
                current={state.currentPage}
              />
            </ConfigProvider>
          </Flex>
        </div>
      )}

      {manage.length <= 0 && !isLoading && (
        <Row
          style={{
            paddingBottom: "32px",
            paddingTop: "24px",
            fontSize: "16px",
            color: "#9B9B9B",
          }}
        >
          <span>
            Bạn không có{" "}
            {type === 0
              ? "cuộc trò chuyện nào được lưu trữ."
              : "liên kết chia sẻ nào được lưu trữ."}
          </span>
        </Row>
      )}
    </Modal>
  );
}
