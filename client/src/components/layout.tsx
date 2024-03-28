import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import { Col, Row } from "antd";
import styles from "../styles/layout.module.scss";
import classNames from "classnames/bind";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const cx = classNames.bind(styles);

export const PrivateLayout = () => {
  const userToken = useSelector((state: RootState) => state.user.user?.token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate("/login");
    }
  }, [navigate, userToken]);

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
