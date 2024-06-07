import styles from "../styles/404.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export const NotFoundPage = () => {
  return (
    <div className={cx("wrapper")}>404 - Không tìm thấy trang yêu cầu</div>
  );
};
