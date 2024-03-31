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
// import CustomButton from "../button";
import { useEffect, useState } from "react";
import CustomButton from "../button";
import { IConversation } from "../../interfaces/chat";
import { ISharedConversation1 } from "../../interfaces/shared";

const { Title } = Typography;

const cx = classNames.bind(styles);

interface ManageHandlersProps {
  handleDeleteAll: () => void;
  handleDelete: (indexToDel: number) => void;
}

interface ShareModalProps extends ModalProps {
  type: number;
  manage: (IConversation | ISharedConversation1)[];
  manageHandlers: ManageHandlersProps;
  isLoading: boolean;
}

interface ShareModalStateProps {
  totalPage: number;
  currentIndex: number;
  currentType: number;
}

const renderContent = (
  item: IConversation | ISharedConversation1,
  type: number,
  index: number,
  manageHandlers: ManageHandlersProps
) => {
  return (
    <Col style={{ gap: 10, padding: "5px 0 5px 0" }}>
      <Row>
        <Flex flex={1} align="center" style={{ paddingRight: "16px" }}>
          <a style={{ fontWeight: "400" }}>
            {"title" in item ? item.title : item.sharedCode}
          </a>
        </Flex>
        <Flex flex={1} align="center">
          <Flex flex={1}>
            <span className={cx("titleMain")}>{item.createdAt}</span>
          </Flex>
          <Flex flex={1} justify="end">
            {type === 0 ? (
              <Tooltip title="Bỏ lưu trữ">
                <ContainerOutlined className={cx("icon")} />
              </Tooltip>
            ) : (
              <Tooltip title="Bỏ chia sẻ">
                <ShareAltOutlined className={cx("icon")} />
              </Tooltip>
            )}
            <Tooltip title="Xóa lưu trữ">
              <DeleteOutlined
                className={cx("icon")}
                onClick={() => manageHandlers.handleDelete(index)}
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
const TOTAL_ITEM_PAGE = 4;

export default function ManageModal({
  type,
  manage,
  manageHandlers,
  isLoading,
  ...props
}: ShareModalProps) {
  const [state, setState] = useState<ShareModalStateProps>({
    totalPage: 1,
    currentType: -1,
    currentIndex: 0,
  });

  useEffect(() => {
    const totalPage = Math.ceil(manage.length / TOTAL_ITEM_PAGE) * 10;
    setState((prev) => ({ ...prev, totalPage: totalPage }));
  }, [manage.length, manage, type]);

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    const newStartIndex = (pageNumber - 1) * TOTAL_ITEM_PAGE;
    setState((prev) => ({
      ...prev,
      currentIndex: newStartIndex,
    }));
  };

  return (
    <Modal
      styles={{
        content: {
          flex: 1,
          backgroundColor: "#2F2F2F",
        },
      }}
      width={800}
      footer={null}
      className={cx("wrapper")}
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
        <Flex flex={1} align="center" style={{ paddingRight: "16px" }}>
          <span className={cx("titleMain")}>Tên</span>
        </Flex>
        <Flex flex={1}>
          <Flex flex={1} align="center">
            <span className={cx("titleMain")}>Ngày</span>
          </Flex>
          <Flex flex={1} justify="end" align="center">
            <CustomButton
              outlined={true}
              status={"important"}
              background={true}
              onClick={() => {
                manageHandlers.handleDeleteAll();
                setState((prev) => ({ ...prev, isLoading: false }));
              }}
            >
              Xóa tất cả
            </CustomButton>
          </Flex>
        </Flex>
      </Row>
      <span className="horizontal"></span>
      {manage.length > 0 &&
        !isLoading &&
        manage
          .slice(state.currentIndex, state.currentIndex + TOTAL_ITEM_PAGE)
          .map((item, index) =>
            renderContent(item, type, index, manageHandlers)
          )}
      {isLoading && (
        <Flex justify="center">
          <Spin />
        </Flex>
      )}

      {manage.length > 0 && (
        <Flex justify="center" align="center" style={{ padding: 10 }}>
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
              defaultCurrent={0}
              total={state.totalPage}
              onChange={onChangePage}
              showLessItems={true}
            />
          </ConfigProvider>
        </Flex>
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
