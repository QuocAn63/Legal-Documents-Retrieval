import classNames from "classnames/bind";
import styles from "../styles/login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, Input, Result, Space } from "antd";
import Title from "antd/es/typography/Title";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";
import { Link } from "react-router-dom";
import Paragraph from "antd/es/typography/Paragraph";
import AuthService from "../services/auth.service";
import { useState } from "react";
import { ResultStatusType } from "antd/es/result";
import { loginValidateObjects } from "../helpers/validates";

const cx = classNames.bind(styles);

const schema = z.object({
  password: loginValidateObjects.password,
  passwordConfirm: loginValidateObjects.passwordConfirm,
});

export interface IResetPasswordInput {
  password: string;
  passwordConfirm: string;
}

export default function ResetPassword() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IResetPasswordInput>({
    resolver: zodResolver(schema),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState<{
    isSent: boolean;
    status: ResultStatusType;
    message: string;
  }>({ isSent: false, status: "info", message: "" });

  const onSubmit: SubmitHandler<IResetPasswordInput> = async (data) => {
    try {
      setIsLoading(true);
      const response = await AuthService.forgotPasswordAccepted(data);

      if (response.status === 200) {
        setSentStatus((prev) => ({ ...prev, isSent: true, status: "success" }));
        setIsLoading(false);
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || "Error form server";

      setIsLoading(false);
      setError("root", { message });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("titleSection")}>
        <Title level={1}>Đặt lại mật khẩu mới</Title>
      </div>
      <Form action="post" onFinish={handleSubmit(onSubmit)}>
        <Space direction="vertical" className={cx("contentGroup")} size={20}>
          {!sentStatus.isSent ? (
            <>
              <FormItem control={control} name="password">
                <Input
                  id="password"
                  variant="outlined"
                  placeholder="Mật khẩu"
                  type="password"
                  className={cx("textBox")}
                />
              </FormItem>
              <FormItem control={control} name="passwordConfirm">
                <Input
                  id="passwordConfirm"
                  variant="outlined"
                  placeholder="Nhập lại mật khẩu"
                  type="password"
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
              status={sentStatus.status}
              title={
                sentStatus.status === "success" ? "Thành công" : "Thất bại"
              }
              subTitle={<Paragraph>{sentStatus.message}</Paragraph>}
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
