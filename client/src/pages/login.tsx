import classNames from "classnames/bind";
import styles from "../styles/login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import { Button, Form, Input, Space } from "antd";
import Title from "antd/es/typography/Title";
import { FormItem } from "react-hook-form-antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Paragraph from "antd/es/typography/Paragraph";
import { useDispatch } from "react-redux";
import { loginRedux } from "../redux/user";
import { GoogleCircleFilled } from "@ant-design/icons";
import useAxios from "../hooks/axios";
const cx = classNames.bind(styles);

export interface ILoginInput {
  email: string;
  password: string;
}

export default function Login() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ILoginInput>({
    defaultValues: {
      email: "caoan632002@gmail.com",
      password: "123123",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useAxios();
  const authService = new AuthService(instance);
  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    try {
      setIsLoading(() => true);
      const response = await authService.login(data);
      if (response.status === 200) {
        setIsLoading(() => false);
        dispatch(loginRedux(response.data));
        navigate("/");
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || "Error when";

      setIsLoading(() => false);
      setError("root", { message });
    }
  };

  // const handleLoginGoogle = async () => {
  //   const loginGoogle = await AuthService.loginGoogle();
  //   if (loginGoogle.status === 200) {
  //     const googlePopUp = window.open();
  //     googlePopUp!.location.href = loginGoogle.data;
  //   }
  // };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("titleSection")}>
        <Title level={1}>ChatBOT</Title>
      </div>
      <Form action="post" onFinish={handleSubmit(onSubmit)}>
        <Space direction="vertical" className={cx("contentGroup")} size={20}>
          <FormItem control={control} name="email">
            <Input
              id="email"
              variant="outlined"
              placeholder="Tên tài khoản"
              className={cx("textBox")}
            />
          </FormItem>
          <FormItem control={control} name="password">
            <Input
              id="password"
              variant="outlined"
              placeholder="Mật khẩu"
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
            type="primary"
            size="large"
            htmlType="submit"
            className={cx("btn")}
            loading={isLoading}
          >
            Đăng nhập
          </Button>
          <Space
            direction="vertical"
            align="center"
            style={{ textAlign: "center", width: "100%" }}
          >
            <Link to="/forgotpwd">Quên mật khẩu?</Link>
            <Paragraph>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </Paragraph>
          </Space>
        </Space>
      </Form>
      <hr />

      <div>
        <Button
          className={cx("btn")}
          icon={<GoogleCircleFilled />}
          // onClick={handleLoginGoogle}
        >
          Đăng nhập bằng Google
        </Button>
      </div>
    </div>
  );
}
