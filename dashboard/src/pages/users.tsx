import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import { IUser } from "../models/users";
import {
  CloseCircleOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import UserService from "../common/services/users.service";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";
import { ToDataSource } from "../common/services/toDataSource";
import useAxios from "../common/hooks/axios";
import useMessage from "antd/es/message/useMessage";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { userUpdate } from "../redux/slices/user";
import moment from "moment";

type ModalType = "SEARCH" | "SAVE" | "DELETE" | "";

type PageStateType = {
  dataSource: IUser[];
  user: IUser | null;
  filter: {
    pageIndex: number;
    pageSize: number;
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
];

export const UsersPage = () => {
  const filterRedux = useSelector((state: RootState) => state.user.user);
  const [state, setState] = useState<PageStateType>({
    dataSource: [],
    user: null,
    filter: {
      pageIndex: 1,
      pageSize: 20,
      email: filterRedux.email,
      from: filterRedux.from,
      to: filterRedux.to,
    },
    loading: false,
    modal: "",
    selectedIDs: [],
  });
  const [api, contextHolder] = useMessage();
  const { control, handleSubmit } = useForm<IUserSearchInput>({
    resolver: zodResolver(searchSchema),
  });
  const { instance } = useAxios();
  const userService = new UserService(instance);
  const dispatch = useDispatch();
  const getDataSource = async () => {
    setState((prev) => ({ ...prev, loading: true }));
    let dataSource = [];

    try {
      let response = await userService.getList(
        state.filter.pageIndex,
        state.filter.pageSize,
        {
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

  useEffect(() => {
    getDataSource();
  }, [
    state.filter.email,
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
    const from = data.from ? data.from["$d"].toISOString() : "";
    const to = data.to ? data.to["$d"].toISOString() : "";

    dispatch(
      userUpdate({
        from,
        to,
        email: data.email,
      })
    );
    setState((prev) => ({
      ...prev,
      filter: { ...prev.filter, ...data, from, to },
      modal: "",
    }));
  };

  const handleDeleteButton = async () => {
    try {
      const response = await userService.delete(state.selectedIDs);
      await getDataSource();
      console.log(response);
    } catch (err: any) {
      const message = err.message || err.response?.message || "Lỗi";

      api.error(message);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={cx("wrapper")}>
        <div className={cx("section_title")}>
          <Typography.Title level={4}>Quản lý người dùng</Typography.Title>
        </div>
        <div className={cx("section_content")}>
          <Flex justify="space-between" className="mb-5">
            <Flex gap={10} align="center">
              <Button
                icon={<SearchOutlined />}
                onClick={() => handleOpenModal("SEARCH", () => {})}
              >
                Tìm kiếm
              </Button>
              {state.filter.email ? (
                <Tag
                  className="text-sm leading-8"
                  closeIcon={<CloseCircleOutlined />}
                  onClose={() =>
                    setState((prev) => ({
                      ...prev,
                      filter: { ...prev.filter, email: "" },
                    }))
                  }
                >
                  Email: {state.filter.email}
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
              defaultCurrent: state.filter.pageIndex,
              defaultPageSize: state.filter.pageSize,
            }}
            columns={columns}
            dataSource={state?.dataSource}
            rowSelection={{
              type: "checkbox",
              onChange: (_: React.Key[], selectedRows: IUser[]) => {
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
