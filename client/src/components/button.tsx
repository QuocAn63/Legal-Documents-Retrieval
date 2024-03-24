import { Button, ButtonProps } from "antd";
import styles from "../styles/button.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

export interface CustomButtonProps extends ButtonProps {
  selected?: boolean;
  outlined?: boolean;
  status?: "normal" | "important" | "primary";
  background?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  selected = false,
  className,
  outlined = false,
  status = "normal",
  background,
  ...props
}) => {
  const elementClassName = cx(
    className,
    "wrapper",
    { outlined },
    {
      selected,
    },
    { important: status === "important" },
    {
      primary: status === "primary",
    },
    {
      background,
    }
  );

  return (
    <Button {...props} className={elementClassName}>
      {props.children}
    </Button>
  );
};

export default CustomButton;
