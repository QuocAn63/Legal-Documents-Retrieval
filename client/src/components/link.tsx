import { FC } from "react";
import { Link, LinkProps } from "react-router-dom";
import styles from "../styles/link.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const CustomLink: FC<LinkProps> = ({ className, ...props }) => {
  const elementClassName = cx(className, "wrapper");
  return <Link className={elementClassName} {...props}></Link>;
};

export default CustomLink;
