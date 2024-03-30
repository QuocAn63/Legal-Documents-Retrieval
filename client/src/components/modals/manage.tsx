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

const { Title } = Typography;

const cx = classNames.bind(styles);

interface ShareModalProps extends ModalProps {
  type: number;
}

interface ShareModalStateProps {
  isLoading: boolean;
  data: any[];
}

// Fake dữ liệu Archived

const data: any[] = [
  { name: "Push git lên code", date: "28/03/2024" },
  { name: "React native là gì", date: "28/03/2024" },
  { name: "Sơn Tùng MTP top 1 VN phải không", date: "28/03/2024" },
  { name: "Jack là ai", date: "28/03/2024" },
];

const dataPage2: any[] = [
  { name: "Tại sao lại như vậy", date: "28/03/2024" },
  { name: "PHP là gì", date: "28/03/2024" },
  { name: "Quá khứ của J97", date: "28/03/2024" },
  { name: "Mcyi", date: "28/03/2024" },
];

const renderContent = (
  item: { name: string; date: string },
  type: number,
  handleDelete: (indexDel: number) => void,
  index: number
) => {
  return (
    <Col style={{ gap: 10, padding: "5px 0 5px 0" }}>
      <Row>
        <Flex flex={1} align="center" style={{ paddingRight: "16px" }}>
          <a style={{ fontWeight: "400" }}>{item.name}</a>
        </Flex>
        <Flex flex={2} align="center">
          <Flex flex={1}>
            <span className={cx("titleMain")}>{item.date}</span>
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
                onClick={() => handleDelete(index)}
              />
            </Tooltip>
          </Flex>
        </Flex>
      </Row>
      <span className="horizontal"></span>
    </Col>
  );
};

export default function ManageModal({ type, ...props }: ShareModalProps) {
  const [state, setState] = useState<ShareModalStateProps>({
    isLoading: false,
    data: data,
  });

  useEffect(() => {
    return () => {};
  });

  const handleDeleteAll = () => {
    setState((prev) => ({
      ...prev,
      data: [],
    }));
  };

  const handleDelete = (indexDel: number) => {
    const newData = state.data.filter((_, index) => index !== indexDel);

    console.log(indexDel);

    setState((prev) => ({
      ...prev,
      data: newData,
    }));
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    setState((prev) => ({
      ...prev,
      data: pageNumber === 1 ? data : dataPage2,
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
        <Flex flex={2}>
          <Flex flex={1} align="center">
            <span className={cx("titleMain")}>Ngày</span>
          </Flex>
          <Flex flex={1} justify="end" align="center">
            <CustomButton
              outlined={true}
              status={"important"}
              background={true}
              onClick={handleDeleteAll}
            >
              Xóa tất cả
            </CustomButton>
          </Flex>
        </Flex>
      </Row>
      <span className="horizontal"></span>
      {type === 0 && state.data.length > 0 ? (
        state.data.map((item, index) =>
          renderContent(item, type, handleDelete, index)
        )
      ) : (
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
      {state.data.length > 0 && (
        <Flex justify="center" align="center" style={{ padding: 10 }}>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "black",
              },
              components: {
                Pagination: {
                  itemActiveBg: "rgb(155, 155, 155)",
                  itemActiveColorDisabled: "black",
                },
              },
            }}
          >
            <Pagination
              className={cx("page")}
              showQuickJumper
              defaultCurrent={0}
              defaultPageSize={10}
              total={20}
              onChange={onChangePage}
              showLessItems={true}
            />
          </ConfigProvider>
        </Flex>
      )}
    </Modal>
  );
}
