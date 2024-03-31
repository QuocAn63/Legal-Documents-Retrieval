import { Modal, ModalProps, Flex } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "../../styles/modal.module.scss";
import classNames from "classnames/bind";
import Typography from "antd/es/typography";
import CustomButton from "../button";
import SharedService from "../../services/shared.service";
import { useState } from "react";

const { Title, Paragraph } = Typography;

const cx = classNames.bind(styles);

interface ShareModalProps extends ModalProps {
  conversationID?: string;
}

interface ShareModalStateProps {
  isLoading: boolean;
}

export default function ShareModal({
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
          backgroundColor: "#2F2F2F",
        },
        // mask: {
        //   opacity: 0.7,
        // },
      }}
      footer={null}
      className={cx("wrapper")}
      closeIcon={<CloseOutlined className={cx("btnClose")} />}
      {...props}
    >
      <Title level={5} className={cx("titleMain")}>
        Chia sẻ liên kết Cuộc trò chuyện
      </Title>
      <span className="horizontal"></span>
      <Paragraph className={cx("description")}>
        Các tin nhắn đã gửi sau khi cuộc trò chuyện này được chia sẻ sẽ không
        hiển thị.
      </Paragraph>
      <Flex justify="flex-end" gap={20} className={cx("btnGroup")}>
        <CustomButton onClick={handleClickPreviewBtn}>Xem trước</CustomButton>
        <CustomButton loading={state.isLoading} onClick={handleClickShareBtn}>
          Chia sẻ
        </CustomButton>
      </Flex>
    </Modal>
  );
}
