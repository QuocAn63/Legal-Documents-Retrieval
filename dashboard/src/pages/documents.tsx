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
  Space,
  Table,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { FormItem } from "react-hook-form-antd";
import { ToDataSource } from "../common/services/toDataSource";
import { IReport } from "../models/reports.model";
import TextArea from "antd/es/input/TextArea";
import { DocumentService } from "../common/services/document.service";
import {
  IUpdateDocumentProps,
  UpdateDocument,
  updateSchema,
} from "../components/documents/updateDocument";
import { IDocument } from "../common/interfaces/document";
import useAxios from "../common/hooks/axios";
import { ViewDocument } from "../components/documents/viewDocument";
import {
  AddDocument,
  IAddDocumentProps,
  addSchema,
} from "../components/documents/addDocument";
import useMessage from "antd/es/message/useMessage";
import { ShowMessagesFromError } from "../common/helpers/GetMessageFromError";

type ModalType = "SEARCH" | "UPDATE" | "VIEW" | "" | "DELETE" | "ADD";

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
  document: IDocument;
};

export type ISearchDocumentProps = {
  label: string;
  content: string;
  from: any;
  to: any;
};

const cx = classNames.bind(styles);

const searchSchema = z.object({
  label: z.string().optional(),
  content: z.string().optional(),
  rank: z.any().optional(),
  from: z.any().optional(),
  to: z.any().optional(),
});

export const BaseDocument: IDocument = {
  id: "",
  configID: "",
  content: "",
  createdAt: "",
  label: "",
  rank: 0,
  updatedAt: "",
};

export const DocumentPage = () => {
  const [api, contextHolder] = useMessage();
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
    document: BaseDocument,
  });
  const {
    control: searchControl,
    handleSubmit: searchHandleSubmit,
    setValue: searchSetValue,
  } = useForm<ISearchDocumentProps>({
    resolver: zodResolver(searchSchema),
  });
  const {
    control: addControl,
    handleSubmit: addHandleSubmit,
    setValue: addSetValue,
  } = useForm<IAddDocumentProps>({
    resolver: zodResolver(addSchema),
    defaultValues: {
      rank: "0",
    },
  });
  const {
    control: updateControl,
    handleSubmit: updateHandleSubmit,
    setValue: updateSetValue,
  } = useForm<IUpdateDocumentProps>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      rank: "0",
    },
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

  const { instance } = useAxios();
  const documentService = new DocumentService(instance);

  const loadInitialData = async () => {
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
    loadInitialData();
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

  const onSearchSubmit: SubmitHandler<ISearchDocumentProps> = async (data) => {
    const from = data.from ? data.from["$d"].toISOString() : "";
    const to = data.to ? data.to["$d"].toISOString() : "";

    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...data, from, to },
      modal: "",
    }));
  };

  const onAddSubmit: SubmitHandler<IAddDocumentProps> = async (data) => {
    try {
      const response = await documentService.add_documents({
        ...data,
        content: JSON.stringify(data.content),
        rank: Number.parseInt(data.rank),
        configID: "45C6BE2C-EE1F-EF11-B3C3-E0D464DFA281",
      });

      if (response.status === 201) {
        api.success(response.message);
        await loadInitialData();
        setState((prev) => ({ ...prev, modal: "" }));
      }
    } catch (err) {
      ShowMessagesFromError(err, api);
    }
  };

  const onUpdateSubmit: SubmitHandler<IAddDocumentProps> = async (data) => {
    try {
      const response = await documentService.update_documents({
        ...data,
        content: JSON.stringify(data.content),
        rank: Number.parseInt(data.rank),
        configID: "45C6BE2C-EE1F-EF11-B3C3-E0D464DFA281",
      });

      if (response.status === 201) {
        api.success(response.message);
        await loadInitialData();
        setState((prev) => ({ ...prev, modal: "" }));
      }
    } catch (err) {
      ShowMessagesFromError(err, api);
    }
  };

  const onDeleteSubmit = async () => {
    try {
      const response = await documentService.delete_documents({
        IDs: state.selectedIDs,
      });

      if (response.status === 200) {
        await loadInitialData();
        setState((prev) => ({ ...prev, modal: "" }));
        api.success(response.message);
      }
    } catch (err) {
      ShowMessagesFromError(err, api);
    }
  };

  return (
    <>
      {contextHolder}
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
            <Space>
              <Button
                icon={<PlusCircleOutlined />}
                className="btn-save"
                onClick={() => handleOpenModal("ADD", () => {})}
              >
                Thêm
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleOpenModal("DELETE", () => {})}
              >
                Xóa
              </Button>
            </Space>
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
        onOk={searchHandleSubmit(onSearchSubmit)}
        onCancel={() => handleCloseModal(() => {})}
        title="Tìm kiếm"
        destroyOnClose
      >
        <Form>
          <Space size="small" direction="vertical" style={{ width: "100%" }}>
            <FormItem control={searchControl} name="label">
              <TextArea placeholder="Nhãn" />
            </FormItem>
            <FormItem control={searchControl} name="content">
              <TextArea placeholder="Nội dung" style={{ minHeight: "150px" }} />
            </FormItem>
            <Space style={{ width: "100%" }}>
              <FormItem control={searchControl} name="from">
                <DatePicker placeholder="Từ ngày" />
              </FormItem>
              <FormItem control={searchControl} name="to">
                <DatePicker placeholder="Đến ngày" />
              </FormItem>
            </Space>
          </Space>
        </Form>
      </Modal>
      <Modal
        open={state.modal === "ADD"}
        onCancel={() => handleCloseModal(() => {})}
        width={960}
        title="Thêm tài liệu"
        okText="Thêm"
        onOk={() => addHandleSubmit(onAddSubmit)()}
        destroyOnClose
      >
        <AddDocument
          document={state.document}
          control={addControl}
          setValue={addSetValue}
        />
      </Modal>
      <Modal
        open={state.modal === "VIEW"}
        onCancel={() => handleCloseModal(() => {})}
        footer={null}
        width={960}
      >
        <ViewDocument document={state.document} />
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
        okText="Lưu"
        cancelText="Hủy"
        destroyOnClose
        onOk={() => updateHandleSubmit(onUpdateSubmit)()}
      >
        <UpdateDocument
          document={state.document}
          setValue={updateSetValue}
          control={updateControl}
        />
      </Modal>
      <Modal
        open={state.modal === "DELETE"}
        okText="Xác nhận"
        title="Xóa tài liệu"
        cancelText="Hủy"
        onOk={onDeleteSubmit}
        onCancel={() => handleCloseModal(() => {})}
      ></Modal>
    </>
  );
};
