import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { Col, Row } from "antd";
import styles from "../styles/layout.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export const DefaultLayout = () => {
  return (
    <Row>
      <Col span={4}>
        <Sidebar />
      </Col>
      <Col span={20}>
        <div className={cx("wrapper")}>
          <Outlet />
        </div>
      </Col>
    </Row>
  );
};
