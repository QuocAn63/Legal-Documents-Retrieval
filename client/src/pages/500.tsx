import styles from "../styles/404.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export const ServerErrorPage = () => {
  return (
    <div className={cx("wrapper")}>
      Lỗi xảy ra trong quá trình thực thi, vui lòng thử lại sau.
    </div>
  );
};
