import { Modal, ModalProps, Flex, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "../../styles/modal.module.scss";
import classNames from "classnames/bind";
import Typography from "antd/es/typography";
import CustomButton from "../button";
import SharedService from "../../services/shared.service";
import { useState } from "react";

const { Title } = Typography;

const cx = classNames.bind(styles);

interface ShareModalProps extends ModalProps {
  conversationID?: string;
}

interface ShareModalStateProps {
  isLoading: boolean;
}

// Fake dữ liệu Archived

const archived = [
  { name: "Push git lên code", date: "28/03/2024" },
  { name: "React native là gì", date: "28/03/2024" },
  { name: "Sơn Tùng MTP top 1 VN phải không", date: "28/03/2024" },
  { name: "Jack là ai", date: "28/03/2024" },
];

const renderArchived = (item: { name: string; date: string }) => {
  return (
    <Col style={{ gap: 10, padding: "15px 0 15px 0" }}>
      <Row>
        <Flex flex={1} align="center">
          <span style={{ color: "rgb(58, 136, 255)", fontWeight: "400" }}>
            {item.name}
          </span>
        </Flex>
        <Flex flex={1} align="center">
          <Flex flex={1}>
            <span className={cx("titleMain")}>{item.date}</span>
          </Flex>
          <Flex flex={1} justify="end">
            <CustomButton className={cx("titleMain")}>
              Mốt thế bằng icon
            </CustomButton>
          </Flex>
        </Flex>
      </Row>
    </Col>
  );
};

export default function ArchivedModal({
  conversationID,
  ...props
}: ShareModalProps) {
  const [state, setState] = useState<ShareModalStateProps>({
    isLoading: false,
  });
  const handleClickPreviewBtn = () => {
    window.open(`/preview/${conversationID}`, "_blank");
  };

  const handleClickShareBtn = async () => {
    if (conversationID) {
      setState((prev) => ({ ...prev, isLoading: true }));
      const saveResponse = await SharedService.save_shared(conversationID);
      console.log(saveResponse);

      setState((prev) => ({ ...prev, isLoading: false }));
    } else return;
  };

  return (
    <Modal
      styles={{
        content: {
          flex: 1,
          //   width: "auto",
          //   minWidth: "800px",
          backgroundColor: "#2F2F2F",
        },
        mask: {
          opacity: 0.4,
        },
      }}
      width={800}
      footer={null}
      className={cx("wrapper")}
      //   centered={true}
      closeIcon={<CloseOutlined className={cx("btnClose")} />}
      {...props}
    >
      <Title level={5} className={cx("titleMain")}>
        Cuộc trò chuyện đã lưu
      </Title>
      <span className="horizontal"></span>
      <Row>
        <Flex flex={1} align="center">
          <span className={cx("titleMain")}>Name</span>
        </Flex>
        <Flex flex={1}>
          <span className={cx("titleMain")}>Date created</span>
        </Flex>
      </Row>
      <span className="horizontal"></span>
      {archived.map((item) => renderArchived(item))}

      {/* <Col>
        <Row>
          <Flex flex={1} align="center">
            <span style={{ color: "rgb(58, 136, 255)", fontWeight: "400" }}>
              Push code lên git
            </span>
          </Flex>
          <Flex flex={1} align="center">
            <span className={cx("titleMain")}>28/3/2024</span>
          </Flex>
        </Row>
      </Col> */}

      {/* <Flex justify="flex-end" gap={20} className={cx("btnGroup")}>
        <CustomButton onClick={handleClickPreviewBtn}>Xem trước</CustomButton>
        <CustomButton loading={state.isLoading} onClick={handleClickShareBtn}>
          Chia sẻ
        </CustomButton>
      </Flex> */}
    </Modal>
  );
}
