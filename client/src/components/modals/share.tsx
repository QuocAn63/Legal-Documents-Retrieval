import { Modal, ModalProps, Flex, message } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import styles from "../../styles/modal.module.scss";
import classNames from "classnames/bind";
import Typography from "antd/es/typography";
import CustomButton from "../button";
import SharedService from "../../services/shared.service";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useAxios from "../../hooks/axios";

const { Title, Paragraph } = Typography;

const cx = classNames.bind(styles);

interface ShareModalProps extends ModalProps {
  conversationID: string;
}

interface ShareModalStateProps {
  isLoading: boolean;
  sharedCode: string;
}

export default function ShareModal({
  conversationID,
  ...props
}: ShareModalProps) {
  const [state, setState] = useState<ShareModalStateProps>({
    isLoading: false,
    sharedCode: "",
  });
  const [messageApi, contextHolder] = message.useMessage();
  const { instance } = useAxios();
  const sharedService = new SharedService(instance);

  const loadInitialData = async () => {};

  useEffect(() => {
    loadInitialData();
    return () => {
      setState((prev) => ({ ...prev, sharedCode: "", isLoading: false }));
    };
  }, [props.open]);

  const handleClickShareBtn = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    if (conversationID) {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const saveResponse = await sharedService.save_shared(conversationID);

        if (saveResponse.status === 201) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            sharedCode: saveResponse.data,
          }));
        }
      } catch (err: any) {
        const message = err.response.data.message;
        messageApi.error(message);
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
      }
    }
  };

  const handleClickCopyBtn = async () => {
    const url = `http://localhost:5173/s/${state.sharedCode}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <Modal
      styles={{
        content: {
          flex: 1,
          backgroundColor: "#2F2F2F",
        },
      }}
      footer={null}
      className={cx("wrapper")}
      closeIcon={<CloseOutlined className={cx("btnClose")} />}
      destroyOnClose
      {...props}
    >
      {contextHolder}
      <Title level={5} className={cx("titleMain")}>
        Chia sẻ liên kết Cuộc trò chuyện
      </Title>
      <span className="horizontal"></span>
      <Paragraph className={cx("description")}>
        Các tin nhắn đã gửi sau khi cuộc trò chuyện này được chia sẻ sẽ không
        hiển thị.
      </Paragraph>
      <Flex justify="flex-end" gap={20} className={cx("btnGroup")}>
        {state.sharedCode !== "" ? (
          <CustomButton loading={state.isLoading} onClick={handleClickCopyBtn}>
            Sao chép
          </CustomButton>
        ) : (
          <CustomButton loading={state.isLoading} onClick={handleClickShareBtn}>
            Chia sẻ
          </CustomButton>
        )}
      </Flex>
    </Modal>
  );
}
