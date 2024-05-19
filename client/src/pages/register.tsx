import classNames from "classnames/bind";
import styles from "../styles/login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, Input, Space } from "antd";
import Title from "antd/es/typography/Title";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useState } from "react";
import AuthService from "../services/auth.service";
import Paragraph from "antd/es/typography/Paragraph";
import { loginValidateObjects } from "../helpers/validates";

const cx = classNames.bind(styles);

const schema = z.object({
  email: loginValidateObjects.email,
  password: loginValidateObjects.password,
  passwordConfirm: loginValidateObjects.passwordConfirm,
});

export interface IRegisterInput {
  password: string;
  passwordConfirm: string;
  // email: string;
  username: string;
}

export default function Register() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IRegisterInput>({
    resolver: zodResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: SubmitHandler<IRegisterInput> = async (data) => {
    try {
      setIsLoading(() => true);
      const response = await AuthService.register(data);

      if (response.status === 200) {
        setIsLoading(() => false);
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || "Error when";

      setIsLoading(() => false);
      setError("root", { message });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("titleSection")}>
        <Title level={1}>ChatBOT</Title>
        <Title level={5}>Đăng ký tài khoản để sử dụng ChatBOT</Title>
      </div>
      <Form action="post" onFinish={handleSubmit(onSubmit)}>
        <Space direction="vertical" className={cx("contentGroup")} size={20}>
          <FormItem control={control} name="email">
            <Input
              variant="outlined"
              placeholder="Địa chỉ Email"
              className={cx("textBox")}
            />
          </FormItem>
          <FormItem control={control} name="password">
            <Input
              variant="outlined"
              placeholder="Mật khẩu"
              className={cx("textBox")}
              type="password"
            />
          </FormItem>
          <FormItem control={control} name="passwordConfirm">
            <Input
              id="passwordConfirm"
              variant="outlined"
              placeholder="Nhập lại mật khẩu"
              className={cx("textBox")}
              type="password"
            />
          </FormItem>
          {errors.root?.message ? (
            <Paragraph className={cx("generalErrorTitle")}>
              {errors.root.message}
            </Paragraph>
          ) : null}
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            className={cx("btn")}
            loading={isLoading}
          >
            Đăng ký
          </Button>
          <div style={{ textAlign: "center" }}>
            <Paragraph>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </Paragraph>
          </div>
        </Space>
      </Form>
      {/* <hr />
      <div>
        <Button icon={<GoogleCircleFilled />}>Đăng nhập bằng Google</Button>
      </div> */}
    </div>
  );
}
