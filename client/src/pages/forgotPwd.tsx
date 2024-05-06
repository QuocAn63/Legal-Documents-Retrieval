import classNames from "classnames/bind";
import styles from "../styles/login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, Input, Result, Space } from "antd";
import type { InputRef } from "antd";
import Title from "antd/es/typography/Title";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";
import { Link } from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";
import AuthService from "../services/auth.service";
import { useRef, useState } from "react";
import { loginValidateObjects } from "../helpers/validates";

const cx = classNames.bind(styles);

const schema = z.object({
  email: loginValidateObjects.email,
});

export interface IForgotPwdInput {
  email: string;
}

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<IForgotPwdInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "caoan632002@gmail.com",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState({ isSent: false, email: "" });

  const onSubmit: SubmitHandler<IForgotPwdInput> = async (data) => {
    try {
      setIsLoading(true);

      const response = await AuthService.forgotPassword(data);

      if (response.status === 200) {
        setSentStatus((prev) => ({ ...prev, isSent: true, email: data.email }));
        setIsLoading(false);
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || "Error when";
      setIsLoading(false);
      setError("root", { message });
    }
  };
  const handleFocus = () => {
    setError("root", { message: "" });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("titleSection")}>
        <Title level={1}>Đặt lại mật khẩu</Title>
        {!sentStatus.isSent ? (
          <Title level={5}>
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để
            đặt lại mật khẩu.
          </Title>
        ) : null}
      </div>

      <Form action="post" onFinish={handleSubmit(onSubmit)}>
        <Space direction="vertical" className={cx("contentGroup")} size={20}>
          {!sentStatus.isSent ? (
            <>
              <FormItem control={control} name="email">
                <Input
                  onFocus={handleFocus}
                  id="email"
                  variant="outlined"
                  placeholder="Địa chỉ Email"
                  className={cx("textBox")}
                />
                {errors.root?.message ? (
                  <Paragraph className={cx("generalErrorTitle")}>
                    {errors.root.message}
                  </Paragraph>
                ) : null}
              </FormItem>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className={cx("btn")}
                loading={isLoading}
              >
                Tiếp tục
              </Button>
            </>
          ) : (
            <Result
              status="info"
              title="Đã gửi liên kết"
              subTitle={
                <Paragraph>
                  Một liên kết reset mật khẩu đã được gửi đến{" "}
                  <Paragraph strong underline>
                    {sentStatus.email}
                  </Paragraph>
                </Paragraph>
              }
            ></Result>
          )}
          <div style={{ textAlign: "center" }}>
            <p>
              <Link to="/login">Trở lại trang đăng nhập</Link>
            </p>
          </div>
        </Space>
      </Form>
    </div>
  );
}
