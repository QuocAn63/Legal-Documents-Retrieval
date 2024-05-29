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
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { FormItem } from "react-hook-form-antd";
import { ToDataSource } from "../common/services/toDataSource";
import ReportService from "../common/services/reports.service";
import { IReport } from "../models/reports.model";
import TextArea from "antd/es/input/TextArea";
import { DocumentService } from "../common/services/document.service";
import { Editor } from "../components/editor";
import { IDocument } from "../common/interfaces/document";
type ModalType = "SEARCH" | "UPDATE" | "VIEW" | "" | "DELETE";

type PageStateType = {
  dataSource: IReport[];
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
  document?: IDocument;
};

export type IDocumentInput = {
  label: string;
  content: string;
  from: any;
  to: any;
};

const cx = classNames.bind(styles);

const searchSchema = z.object({
  from: z.any().optional(),
  to: z.any().optional(),
});

export const DocumentPage = () => {
  const [state, setState] = useState<PageStateType>({
    dataSource: [],
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
    document: undefined,
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IDocumentInput>({
    resolver: zodResolver(searchSchema),
  });

  const columns = [
    {
      title: "Mã",
      key: "id",
      dataIndex: "id",
      width: 200,
    },
    {
      title: "Nhãn",
      key: "label",
      dataIndex: "label",
      width: 250,
    },
    {
      title: "Nội dung",
      key: "content",
      dataIndex: "content",
      ellipsis: true,
      render: (value: string, record: any) => {
        return (
          <Button
            type="link"
            onClick={async () => {
              const response = await documentService.get_documents(record.id);

              if (response.status === 200) {
                setState((prev) => ({
                  ...prev,
                  modal: "VIEW",
                  document: response.data,
                }));
              } else {
              }
            }}
          >
            {value}
          </Button>
        );
      },
    },
    {
      title: "Thứ tự",
      key: "rank",
      dataIndex: "rank",
      width: 80,
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
      title: "Sửa",
      width: 120,
      render: (_: string, record: any) => (
        <Button
          onClick={async () => {
            const response = await documentService.get_documents(record.id);

            if (response.status === 200) {
              setState((prev) => ({
                ...prev,
                modal: "UPDATE",
                document: response.data,
              }));
            } else {
            }
          }}
        >
          Sửa
        </Button>
      ),
    },
  ];

  const token = import.meta.env.VITE_AUTH_TOKEN as string;
  const documentService = new DocumentService(token);

  const getDataSource = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    let dataSource = [];

    try {
      let response = await documentService.getList_documents();

      dataSource = ToDataSource(response.data);
    } catch (err) {
      console.log(err);
    }
    setState((prev) => ({ ...prev, dataSource, loading: false }));
  };
  useEffect(() => {
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

  const onSearchSubmit: SubmitHandler<IDocumentInput> = async (data) => {
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

  const handleUpdateReport = async (reportID: string, status: string) => {
    try {
      const response = await ReportService.update(reportID, status);
      await getDataSource();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("section_title")}>
          <Typography.Title level={4}>Quản lý tài liệu</Typography.Title>
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
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => handleOpenModal("DELETE", () => {})}
            >
              Xóa
            </Button>
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
            <FormItem control={control} name="label">
              <TextArea placeholder="Nhãn" />
            </FormItem>
            <FormItem control={control} name="content">
              <TextArea placeholder="Nội dung" style={{ minHeight: "150px" }} />
            </FormItem>
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
        width={960}
      >
        <Editor document={state.document} />
      </Modal>
      <Modal
        title="Sửa tài liệu"
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
        width={960}
        // onOk={async () => {
        //   await handleUpdateReport(state.selectedIDs[0], state.currentStatus);
        //   handleCloseModal(() => {
        //     setState((prev) => ({
        //       ...prev,
        //       currentStatus: "",
        //       selectedIDs: [],
        //       modal: "",
        //     }));
        //   });
        // }}
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
      >
        <Editor state="UPDATE" control={control} />
      </Modal>
    </>
  );
};
