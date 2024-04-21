import { Button, Space, Table, Typography } from "antd";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import { IUser } from "../models/users";
import { useEffect, useState } from "react";
import UserService from "../common/services/users.service";

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
    title: "Thao tác",
    key: "action",
    width: 100,
    render: () => <ActionColumn />,
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
  const [state, setState] = useState<PageState>({
    user: null,
    dataSource: [],
    modal: "",
    pagination: {
      pageIndex: 1,
      pageSize: 20,
    },
  });

  useEffect(() => {
    const loadDataTable = async () => {
      const response = await UserService.getList(
        state.pagination.pageIndex,
        state.pagination.pageSize
      );

      const dataSource = response.data.map((item: any) => ({
        ...item,
        key: item.id,
      }));

      setState((prev) => ({ ...prev, dataSource }));
    };

    loadDataTable();
  }, [state.pagination.pageIndex, state.pagination.pageSize]);

  const handleOpenModal = async (userID: string) => {
    const response = await UserService.get(userID);
    setState((prev) => ({ ...prev, user: response.data }));
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("section_title")}>
        <Typography.Title level={4}>Người dùng</Typography.Title>
      </div>
      <div className={cx("section_content")}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space size="large" style={{ width: "100%" }}>
            <Button>Làm mới</Button>
            <Button>Lưu</Button>
            <Button>Xóa</Button>
          </Space>
          <Table
            pagination={{ position: ["bottomCenter"] }}
            columns={columns}
            dataSource={state.dataSource}
            rowSelection={{
              type: "checkbox",
              onChange: (
                selectedRowKeys: React.Key[],
                selectedRows: IUser[]
              ) => {},
            }}
          ></Table>
        </Space>
      </div>
    </div>
  );
};
