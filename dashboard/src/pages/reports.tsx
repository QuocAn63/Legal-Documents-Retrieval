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
  Tag,
  Typography,
} from "antd";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { FormItem } from "react-hook-form-antd";
import { ToDataSource } from "../common/services/toDataSource";
import ReportService from "../common/services/reports.service";
import { IReport } from "../models/reports.model";
import { IReportReason } from "../models/reportReason.model";
import TextArea from "antd/es/input/TextArea";
import { IMessage } from "../models/message.model";
import Link from "antd/es/typography/Link";
import { ReportStatusLabel } from "../components/reportStatus";
import { MessageItem } from "../components/message";
import useAxios from "../common/hooks/axios";
import useMessage from "antd/es/message/useMessage";
import { ShowMessagesFromError } from "../common/helpers/GetMessageFromError";
import { reportUpdate } from "../redux/slices/report";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import moment from "moment";
type ModalType = "SEARCH" | "UPDATE" | "VIEW" | "";

type PageStateType = {
  dataSource: IReport[];
  report: IReport | null;
  filter: {
    pageIndex: number;
    pageSize: number;
    from: string;
    to: string;
    reasonID?: string;
    description: string;
    status: number;
  };
  modal: ModalType;
  loading: boolean;
  selectedIDs: string[];
  currentStatus: string;
  messages: IMessage[];
};

type IReportSearchInput = {
  reasonID: string;
  description: string;
  status: any;
  from: any;
  to: any;
};

const cx = classNames.bind(styles);

const searchSchema = z.object({
  from: z.any().optional(),
  to: z.any().optional(),
  description: z.string().optional(),
  reasonID: z.string().optional(),
  status: z.any().optional(),
});

export const ReportsPage = () => {
  const filterRedux = useSelector((state: RootState) => state.report.report);
  const [api, contextHolder] = useMessage();
  const [reasons, setReasons] = useState<IReportReason[]>([]);
  const [state, setState] = useState<PageStateType>({
    dataSource: [],
    report: null,
    filter: {
      pageIndex: 1,
      pageSize: 20,
      from: filterRedux.from,
      to: filterRedux.to,
      description: filterRedux.description,
      reasonID: filterRedux.reasonID,
      status: filterRedux.status,
    },
    loading: false,
    modal: "",
    selectedIDs: [],
    messages: [],
    currentStatus: "",
  });
  const { control, handleSubmit } = useForm<IReportSearchInput>({
    resolver: zodResolver(searchSchema),
  });
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Mã",
      key: "id",
      dataIndex: "id",
    },
    {
      title: "Mã tin nhắn",
      key: "messageID",
      dataIndex: "messageID",
      render: (value: string, record: any) => (
        <Link
          onClick={() =>
            handleOpenModal("VIEW", async () => {
              const response = await reportService.getList_messages(record.id);

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
      title: "Lý do",
      key: "reasonID",
      dataIndex: "reasonID",
      render: (value: string) =>
        reasons.find((record) => record.id === value)?.description || "Khác",
    },
    {
      title: "Mô tả",
      key: "description",
      dataIndex: "description",
      width: 220,
    },
    {
      title: "Ngày tạo",
      key: "createdAt",
      dataIndex: "createdAt",
      width: "170px",
    },
    {
      title: "Ngày sửa",
      key: "updatedAt",
      dataIndex: "updatedAt",
      width: "170px",
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (value: number, record: any) => {
        return (
          <Button
            onClick={() => {
              setState((prev) => ({
                ...prev,
                selectedIDs: [record.id],
                modal: "UPDATE",
                currentStatus: record.status,
              }));
            }}
          >
            {ReportStatusLabel[value]}
          </Button>
        );
      },
    },
  ];
  const { instance } = useAxios();
  const reportService = new ReportService(instance);
  const loadInitialData = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    let dataSource = [];

    try {
      let response = await reportService.getList(
        state.filter.pageIndex,
        state.filter.pageSize,
        {
          from: state.filter.from,
          to: state.filter.to,
          description: state.filter.description,
          reasonID: state.filter.reasonID,
          status: state.filter.status,
        }
      );

      dataSource = ToDataSource(response.data);
    } catch (err) {
      console.log(err);
    }

    setState((prev) => ({ ...prev, dataSource, loading: false }));
  };

  const loadReasons = async () => {
    try {
      const response = await reportService.getList_reasons();

      setReasons(response.data);
    } catch (err) {
      ShowMessagesFromError(err, api);
    }
  };

  useEffect(() => {
    loadReasons();
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [state.filter]);

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
    const from = data.from ? data.from["$d"].toISOString() : "";
    const to = data.to ? data.to["$d"].toISOString() : "";

    dispatch(reportUpdate(data));

    setState((prev) => ({
      ...prev,
      filter: {
        ...prev.filter,
        ...data,
        from,
        to,
      },
      modal: "",
    }));
  };

  const handleUpdateReport = async (reportID: string, status: string) => {
    try {
      const response = await reportService.update(reportID, status);

      if (response.status === 200) {
        api.success(response.data);
        await loadInitialData();
      }
    } catch (err) {
      ShowMessagesFromError(err, api);
    } finally {
      handleCloseModal(() => {
        setState((prev) => ({
          ...prev,
          currentStatus: "",
          selectedIDs: [],
          modal: "",
        }));
      });
    }
  };

  return (
    <>
      {contextHolder}
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
              {state.filter.description ? (
                <Tag
                  className="text-sm leading-8"
                  closeIcon={<CloseCircleOutlined />}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, description: "" },
                    }))
                  }
                >
                  Mô tả: {state.filter.description}
                </Tag>
              ) : null}
              {state.filter.reasonID ? (
                <Tag
                  className="text-sm leading-8"
                  closeIcon={<CloseCircleOutlined />}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, reasonID: "" },
                    }))
                  }
                >
                  Lý do:{" "}
                  {reasons.find((record) => record.id === state.filter.reasonID)
                    ?.description || "Khác"}
                </Tag>
              ) : null}
              {state.filter.status ? (
                <Tag
                  className="text-sm leading-8"
                  closeIcon={<CloseCircleOutlined />}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, status: 0 },
                    }))
                  }
                >
                  Trạng thái: {ReportStatusLabel[state.filter.status as any]}
                </Tag>
              ) : null}
              {state.filter.from ? (
                <Tag
                  className="text-sm leading-8"
                  closeIcon={<CloseCircleOutlined />}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, from: "" },
                    }))
                  }
                >
                  Từ ngày: {moment(state.filter.from).format("DD/MM/YYYY")}
                </Tag>
              ) : null}
              {state.filter.to ? (
                <Tag
                  className="text-sm leading-8"
                  closeIcon={<CloseCircleOutlined />}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, to: "" },
                    }))
                  }
                >
                  Đến ngày: {moment(state.filter.to).format("DD/MM/YYYY")}
                </Tag>
              ) : null}
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
              onChange: (_: React.Key[], selectedRows: any[]) => {
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
            <Space style={{ width: "100%" }}>
              <FormItem control={control} name="reasonID">
                <Select
                  options={reasons.map((record) => ({
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
        footer={null}
      >
        <Space direction="vertical" size="large">
          {state.messages.map((message) => (
            <MessageItem {...message}></MessageItem>
          ))}
        </Space>
      </Modal>
      <Modal
        title="Cập nhật trạng thái"
        open={state.modal === "UPDATE"}
        onCancel={() =>
          handleCloseModal(() => {
            setState((prev) => ({
              ...prev,
              currentStatus: "",
              selectedIDs: [],
            }));
          })
        }
        onOk={() =>
          handleUpdateReport(state.selectedIDs[0], state.currentStatus)
        }
        okText="Lưu"
        cancelText="Hủy"
      >
        <Select
          defaultValue={state.currentStatus}
          style={{ width: 200 }}
          onChange={(value) =>
            setState((prev) => ({ ...prev, currentStatus: value }))
          }
          options={ReportStatusLabel.map((label, index) => ({
            value: index,
            label: label,
          }))}
        />
      </Modal>
    </>
  );
};
