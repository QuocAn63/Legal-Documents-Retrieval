import {
  Button,
  Flex,
  Image,
  Modal,
  Space,
  Tooltip,
  Typography,
  ModalProps,
  Form,
  Input,
  message,
} from "antd";
import styles from "../styles/message.module.scss";
import classNames from "classnames/bind";
import { FormItem } from "react-hook-form-antd";
import CustomButton from "./button";
import {
  CheckOutlined,
  CopyOutlined,
  DislikeOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ReportService } from "../services/report.service";
import Title from "antd/es/typography/Title";
import { useForm, SubmitHandler } from "react-hook-form";
import { IMessage } from "../interfaces/chat";
import useAxios from "../hooks/axios";
import { ShowMessagesFromError } from "../helpers/showErrorMessage";

const cx = classNames.bind(styles);

interface ReportModalProps extends ModalProps {
  reasons: ReasonProps[];
  selectedReasonID?: string;
  handleChangeReasonClick: (reasonID: string) => void;
  handleReportClick: (data: any) => Promise<void>;
}

interface ReasonProps {
  id: string;
  description: string;
}

interface IReportDescriptionInput {
  description?: string;
}

const ReportModal = ({
  reasons = [],
  selectedReasonID,
  handleChangeReasonClick,
  handleReportClick,
  ...props
}: ReportModalProps) => {
  const { control, handleSubmit, setValue } =
    useForm<IReportDescriptionInput>();

  const onSubmit: SubmitHandler<IReportDescriptionInput> = async (data) => {
    await handleReportClick(data);
    setValue("description", "");
  };

  return (
    <Modal
      {...props}
      footer={null}
      className={cx("reportModal")}
      closeIcon={<CloseOutlined className={cx("btnClose")} />}
    >
      <Title level={4} className={cx("title")}>
        Đánh giá phản hồi
      </Title>
      <span className="horizontal"></span>
      <Form onFinish={handleSubmit(onSubmit)}>
        <div className={cx("reasonsSection")}>
          <Space wrap>
            {reasons.map((item) => (
              <CustomButton
                type={item.id === selectedReasonID ? "primary" : "default"}
                key={item.id}
                outlined
                onClick={
                  item.id !== selectedReasonID
                    ? () => handleChangeReasonClick(item.id)
                    : () => {}
                }
                selected={item.id === selectedReasonID}
              >
                {item.description}
              </CustomButton>
            ))}
          </Space>
        </div>
        <FormItem control={control} name="description">
          <Input
            autoComplete="off"
            className={cx("textBox")}
            placeholder="(Không bắt buộc) Mô tả lý do"
          />
        </FormItem>
        <Flex justify="flex-end">
          <CustomButton outlined background status="primary" htmlType="submit">
            Gửi
          </CustomButton>
        </Flex>
      </Form>
    </Modal>
  );
};

export interface MessageItemProps extends IMessage {
  onReportClick?: (messageID: string) => void;
  preview?: boolean;
}

export const MessageItem = ({
  id,
  content,
  onReportClick,
  isBOT,
  preview = false,
}: MessageItemProps) => {
  const [state, setState] = useState({
    copyClicked: false,
    reportClicked: false,
    reasons: [],
  });

  const handleCopyClick = async (message: string) => {
    await navigator.clipboard.writeText(message);
    setState((prev) => ({ ...prev, copyClicked: true }));

    setTimeout(() => {
      setState((prev) => ({ ...prev, copyClicked: false }));
    }, 2000);
  };

  const handleReportClick = async (messageID: string) => {
    if (onReportClick) {
      onReportClick(messageID);
    }
  };

  return (
    <Flex
      key={id}
      align="flex-start"
      gap={16}
      className={cx("messageItem", { preview })}
    >
      <Image
        src={isBOT ? "/bot-avatar.png" : "/default-avatar.png"}
        className={cx("avatarHolder")}
        preview={false}
      />
      <Flex gap={8} vertical className={cx("pane")}>
        <Typography.Text strong className={cx("username")}>
          {isBOT ? "BOT" : "Bạn"}
        </Typography.Text>
        <Typography.Text className={cx("content")}>{content}</Typography.Text>
      </Flex>
      {!preview ? (
        isBOT ? (
          <div className={cx("btnContainer")}>
            <Tooltip title="Sao chép nội dung" placement="bottom">
              {state.copyClicked ? (
                <Button
                  type="text"
                  icon={<CheckOutlined />}
                  className={cx("btn")}
                />
              ) : (
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyClick(content)}
                  className={cx("btn")}
                />
              )}
            </Tooltip>
            <Tooltip title="Phản hồi tệ" placement="bottom">
              <Button
                type="text"
                icon={<DislikeOutlined />}
                className={cx("btn", {
                  disabled: state.reportClicked,
                })}
                onClick={() => handleReportClick(id)}
              />
            </Tooltip>
          </div>
        ) : null
      ) : null}
    </Flex>
  );
};

interface MessagesContainerProps {
  messages: IMessage[];
  preview?: boolean;
}

export default function MessagesContainer({
  messages,
  preview = false,
}: MessagesContainerProps) {
  const [state, setState] = useState<{
    reasonModalOpen: boolean;
    reasons: ReasonProps[];
    selectedReasonID: string;
    selectedMessageID: string;
  }>({
    reasonModalOpen: false,
    reasons: [],
    selectedReasonID: "",
    selectedMessageID: "",
  });
  const [messageApi, contextHolder] = message.useMessage();

  const { instance } = useAxios();
  const reportService = new ReportService(instance);

  useEffect(() => {
    const getInitialData = async () => {
      const reasonData = await reportService.getListReasons();

      setState((prev) => ({ ...prev, reasons: reasonData.data }));
    };

    getInitialData();

    return () => {
      clearState();
    };
  }, []);

  const clearState = () => {
    setState({
      selectedMessageID: "",
      selectedReasonID: "",
      reasonModalOpen: false,
      reasons: [],
    });
  };

  const handleChangeReasonClick = (reasonID: string) => {
    console.log(reasonID);
    setState((prev) => ({ ...prev, selectedReasonID: reasonID }));
  };

  const handleCloseReasonModal = () => {
    setState((prev) => ({
      ...prev,
      reasonModalOpen: false,
      selectedReasonID: "",
      selectedMessageID: "",
    }));
  };

  const handleOpenReasonModal = (messageID: string) => {
    setState((prev) => ({
      ...prev,
      reasonModalOpen: true,
      selectedMessageID: messageID,
    }));
  };

  const handleSaveReport = async (data: any) => {
    try {
      const response = await reportService.saveReport({
        messageID: state.selectedMessageID,
        reasonID: state.selectedReasonID,
        description: data.description || "",
      });

      if (response.status === 201) {
        messageApi.success(response.data);
      }
    } catch (err: any) {
      ShowMessagesFromError(err, messageApi);
    }

    handleCloseReasonModal();
  };

  return (
    <>
      {contextHolder}
      <div className={cx("wrapper")}>
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            {...message}
            preview={preview}
            onReportClick={message.isBOT ? handleOpenReasonModal : undefined}
          />
        ))}
      </div>
      {preview ? null : (
        <ReportModal
          styles={{
            content: {
              backgroundColor: "#2F2F2F",
            },
          }}
          selectedReasonID={state.selectedReasonID}
          open={state.reasonModalOpen}
          onOk={handleSaveReport}
          onCancel={handleCloseReasonModal}
          handleChangeReasonClick={handleChangeReasonClick}
          reasons={state.reasons}
          handleReportClick={handleSaveReport}
        ></ReportModal>
      )}
    </>
  );
}
