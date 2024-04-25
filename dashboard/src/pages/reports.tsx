import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Modal,
  Select,
  Space,
  Table,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FormItem } from "react-hook-form-antd";
import { ToDataSource } from "../common/services/toDataSource";
import ReportService from "../common/lib/reports.service";
import { IReport } from "../models/reports.model";
import { IReportReason } from "../models/reportReason.model";
import TextArea from "antd/es/input/TextArea";
import { IMessage } from "../models/message.model";
import Link from "antd/es/typography/Link";
import { ReportStatus } from "../components/reportStatus";
import { MessageItem } from "../components/message";
type ModalType = "SEARCH" | "UPDATE" | "VIEW" | "";

type PageStateType = {
  dataSource: IReport[];
  report: IReport | null;
  reasons: IReportReason[];
  filter: {
    pageIndex: number;
    pageSize: number;
    from: string;
    to: string;
    reasonID: string;
    description: string;
    status: string;
  };
  modal: ModalType;
  loading: boolean;
  selectedIDs: string[];
  messages: IMessage[];
};

type IReportSearchInput = {
  reasonID: string;
  description: string;
  status: string;
  from: any;
  to: any;
};

const cx = classNames.bind(styles);

const searchSchema = z.object({
  from: z.any().optional(),
  to: z.any().optional(),
});

export const ReportsPage = () => {
  const [state, setState] = useState<PageStateType>({
    dataSource: [],
    report: null,
    reasons: [],
    filter: {
      pageIndex: 1,
      pageSize: 20,
      from: "",
      to: "",
      description: "",
      reasonID: "",
      status: "",
    },
    loading: false,
    modal: "",
    selectedIDs: [],
    messages: [],
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IReportSearchInput>({
    resolver: zodResolver(searchSchema),
  });

  const columns = [
    {
      title: "Mã",
      key: "id",
      dataIndex: "id",
      width: "120px",
      ellipsis: true,
    },
    {
      title: "Mã tin nhắn",
      key: "messageID",
      dataIndex: "messageID",
      width: "120px",
      ellipsis: true,
      render: (value: string, record: any) => (
        <Link
          onClick={() =>
            handleOpenModal("VIEW", async () => {
              const response = await ReportService.getList_messages(record.id);

              setState((prev) => ({
                ...prev,
                messages: response.data.messages,
              }));
            })
          }
        >
          {value}
        </Link>
      ),
    },
    {
      title: "Mã người dùng",
      key: "userID",
      dataIndex: "userID",
      width: "120px",
      ellipsis: true,
    },
    {
      title: "Lý do",
      key: "reasonID",
      dataIndex: "reasonID",
      render: (value: string) =>
        state.reasons.find((record) => (record.id = value))?.description,
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      key: "updatedAt",
      dataIndex: "updatedAt",
    },
    {
      title: "Ngày sửa",
      key: "updatedAt",
      dataIndex: "updatedAt",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      width: "80px",
      render: (value: number) => {
        return <ReportStatus status={value}></ReportStatus>;
      },
    },
    {
      title: "Xử lý",
      key: "edit",
      render: (_: any, record: any) => {
        return <Button type="link">Sửa</Button>;
      },
    },
  ];

  useEffect(() => {
    const getDataSource = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      let dataSource = [];
      let reasons = [];

      try {
        let response = await ReportService.getList(
          state.filter.pageIndex,
          state.filter.pageSize,
          {
            from: state.filter.from,
            to: state.filter.to,
          }
        );
        let response1 = await ReportService.getList_reasons();

        dataSource = ToDataSource(response.data);
        reasons = response1.data;
      } catch (err) {
        console.log(err);
      }
      setState((prev) => ({ ...prev, dataSource, reasons, loading: false }));
    };

    getDataSource();
  }, [
    state.filter.pageIndex,
    state.filter.pageSize,
    state.filter.from,
    state.filter.to,
  ]);

  const handleOpenModal = (
    type: ModalType,
    callback: (...data: any) => void
  ) => {
    callback();
    setState((prev) => ({ ...prev, modal: type }));
  };

  const handleCloseModal = (callback: (...data: any) => void) => {
    callback();
    setState((prev) => ({ ...prev, modal: "" }));
  };

  const onSearchSubmit: SubmitHandler<IReportSearchInput> = async (data) => {
    const from = data.from
      ? `${data.from["$D"]}/${data.from["$M"]}/${data.from["$y"]}`
      : "";
    const to = data.to
      ? `${data.to["$D"]}/${data.to["$M"]}/${data.to["$y"]}`
      : "";

    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...data, from, to },
      modal: "",
    }));
  };

  const handleDeleteButton = async () => {
    try {
      // const response = await UserService.delete(state.selectedIDs);
      // console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("section_title")}>
          <Typography.Title level={4}>Quản lý báo cáo</Typography.Title>
        </div>
        <div className={cx("section_content")}>
          <Flex justify="space-between" className="mb-5">
            <Flex gap={10}>
              <Button
                icon={<SearchOutlined />}
                onClick={() => handleOpenModal("SEARCH", () => {})}
              >
                Tìm kiếm
              </Button>
            </Flex>
          </Flex>
          <Table
            loading={state.loading}
            pagination={{
              position: ["bottomCenter"],
              current: state.filter.pageIndex,
            }}
            columns={columns}
            dataSource={state?.dataSource}
            rowSelection={{
              type: "checkbox",
              onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
                setState((prev) => ({
                  ...prev,
                  selectedIDs: selectedRows.map((item) => item.id),
                }));
              },
            }}
          ></Table>
        </div>
      </div>
      <Modal
        open={state.modal === "SEARCH"}
        okText="Tìm"
        cancelText="Hủy"
        onOk={handleSubmit(onSearchSubmit)}
        onCancel={() => handleCloseModal(() => {})}
        title="Tìm kiếm"
        destroyOnClose
      >
        <Form>
          <Space size="small" direction="vertical" style={{ width: "100%" }}>
            <FormItem control={control} name="description">
              <TextArea placeholder="Mô tả" />
            </FormItem>
            <Space
              style={{ width: "100%" }}
              // styles={{ item: { width: "100%" } }}
            >
              <FormItem control={control} name="reasonID">
                <Select
                  options={state.reasons.map((record) => ({
                    label: record.description,
                    value: record.id,
                  }))}
                  dropdownStyle={{ width: "250px" }}
                  placeholder="Lý do"
                />
              </FormItem>
              <FormItem control={control} name="status">
                <Select
                  options={[
                    { label: "Chưa xử lý", value: 0 },
                    { label: "Đang xử lý", value: 1 },
                    { label: "Đã xử lý", value: 2 },
                  ]}
                  dropdownStyle={{ width: "250px" }}
                  placeholder="Tình trạng"
                />
              </FormItem>
            </Space>
            <Space style={{ width: "100%" }}>
              <FormItem control={control} name="from">
                <DatePicker placeholder="Từ ngày" />
              </FormItem>
              <FormItem control={control} name="to">
                <DatePicker placeholder="Đến ngày" />
              </FormItem>
            </Space>
          </Space>
        </Form>
      </Modal>
      <Modal
        open={state.modal === "VIEW"}
        onCancel={() => handleCloseModal(() => {})}
      >
        <Space direction="vertical" size="middle">
          {state.messages.map((message) => (
            <MessageItem {...message}></MessageItem>
          ))}
        </Space>
      </Modal>
    </>
  );
};