import { Table, Typography } from "antd";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import { IUser } from "../models/users";
import { userDataSource } from "../datasources/users";

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
];

export const UsersPage = () => {
  return (
    <div className={cx("wrapper")}>
      <div className={cx("section_title")}>
        <Typography.Title level={4}>Người dùng</Typography.Title>
      </div>
      <div className={cx("section_content")}>
        <Table
          pagination={{ position: ["bottomCenter"] }}
          columns={columns}
          dataSource={userDataSource}
          rowSelection={{
            type: "checkbox",
            onChange: (
              selectedRowKeys: React.Key[],
              selectedRows: IUser[]
            ) => {},
          }}
        ></Table>
      </div>
    </div>
  );
};
