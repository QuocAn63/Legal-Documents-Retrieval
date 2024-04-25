import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import { IUser } from "../models/users";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import UserService from "../common/lib/users.service";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";
import { ToDataSource } from "../common/services/toDataSource";

type ModalType = "SEARCH" | "SAVE" | "DELETE" | "";

type PageStateType = {
  dataSource: IUser[];
  user: IUser | null;
  filter: {
    pageIndex: number;
    pageSize: number;
    username: string;
    email: string;
    from: string;
    to: string;
  };
  modal: ModalType;
  loading: boolean;
  selectedIDs: string[];
};

type IUserSearchInput = {
  email: string;
  username: string;
  from: any;
  to: any;
};

const searchSchema = z.object({
  email: z.string().optional(),
  username: z.string().optional(),
  from: z.any().optional(),
  to: z.any().optional(),
});

const cx = classNames.bind(styles);

const columns = [
  {
    title: "Tên tài khoản",
    key: "username",
    dataIndex: "username",
  },
  {
    title: "Email",
    key: "email",
    dataIndex: "email",
  },
  {
    title: "Ngày tạo",
    key: "createdAt",
    dataIndex: "createdAt",
  },
  {
    title: "Ngày sửa",
    key: "updatedAt",
    dataIndex: "updatedAt",
  },
  {
    title: "Ngày xóa",
    key: "deletedAt",
    dataIndex: "deletedAt",
  },
  {
    title: "Sửa",
    key: "edit",
    render: (_: any, record: any) => {
      return <Button type="link">Sửa</Button>;
    },
  },
];

const ActionColumn = () => {
  return <Button type="link">Sửa</Button>;
};

type PageState = {
  user: IUser | null;
  dataSource: IUser[];
  modal: string;
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
};

export const UsersPage = () => {
  const [state, setState] = useState<PageStateType>({
    dataSource: [],
    user: null,
    filter: {
      pageIndex: 1,
      pageSize: 20,
      username: "",
      email: "",
      from: "",
      to: "",
    },
    loading: false,
    modal: "",
    selectedIDs: [],
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IUserSearchInput>({
    resolver: zodResolver(searchSchema),
  });

  useEffect(() => {
    const getDataSource = async () => {
      setState((prev) => ({ ...prev, loading: true }));
      let dataSource = [];

      try {
        let response = await UserService.getList(
          state.filter.pageIndex,
          state.filter.pageSize,
          {
            username: state.filter.username,
            email: state.filter.email,
            from: state.filter.from,
            to: state.filter.to,
          }
        );

        dataSource = ToDataSource(response.data);
      } catch (err) {
        console.log(err);
      }
      setState((prev) => ({ ...prev, dataSource, loading: false }));
    };

    getDataSource();
  }, [
    state.filter.email,
    state.filter.username,
    state.filter.pageIndex,
    state.filter.pageSize,
    state.filter.from,
    state.filter.to,
  ]);

  const handleOpenModal = (type: ModalType, callback: () => void) => {
    callback();
    setState((prev) => ({ ...prev, modal: type }));
  };

  const handleCloseModal = (callback: () => void) => {
    callback();
    setState((prev) => ({ ...prev, modal: "" }));
  };

  const onSearchSubmit: SubmitHandler<IUserSearchInput> = async (data) => {
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
      const response = await UserService.delete(state.selectedIDs);

      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className={cx("wrapper")}>
        <div className={cx("section_title")}>
          <Typography.Title level={4}>Người dùng</Typography.Title>
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
              onChange: (
                selectedRowKeys: React.Key[],
                selectedRows: IUser[]
              ) => {
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
          <FormItem control={control} name="username">
            <Input placeholder="Tên tài khoản" />
          </FormItem>
          <FormItem control={control} name="email">
            <Input placeholder="Địa chỉ email" />
          </FormItem>
          <Space size="middle">
            <FormItem control={control} name="from">
              <DatePicker placeholder="Từ ngày" />
            </FormItem>
            <FormItem control={control} name="to">
              <DatePicker placeholder="Đến ngày" />
            </FormItem>
          </Space>
        </Form>
      </Modal>
      <Modal
        open={state.modal === "DELETE"}
        okText="Xác nhận"
        title="Xóa người dùng"
        cancelText="Hủy"
        onOk={handleDeleteButton}
        onCancel={() => handleCloseModal(() => {})}
      ></Modal>
    </>
  );
};
