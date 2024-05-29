import Title from "antd/es/typography/Title";
import styles from "../styles/login.module.scss";
import { Button, Form, Input, Space } from "antd";
import { FormItem } from "react-hook-form-antd";
import classNames from "classnames/bind";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import useAxios from "../common/hooks/axios";
import { loginRedux } from "../redux/slices/auth";
import Paragraph from "antd/es/typography/Paragraph";
import Link from "antd/es/typography/Link";
import { AuthService } from "../common/services/auth.service";

const cx = classNames.bind(styles);

export interface ILoginInput {
  email: string;
  password: string;
}

type StateProps = {
  isLoading: boolean;
  oauthURL: string;
};

export const LoginPage = () => {
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

  const [state, setState] = useState<StateProps>({
    isLoading: false,
    oauthURL: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useAxios();
  const authService = new AuthService(instance);

  const onSubmit: SubmitHandler<ILoginInput> = async (data) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await authService.login(data);

      if (response.status === 200) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        dispatch(loginRedux(response.data));
        navigate("/");
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || "Error when";

      setState((prev) => ({ ...prev, isLoading: false }));

      setError("root", { message });
    }
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("titleSection")}>
        <Title level={1}>Quản lý ChatBOT</Title>
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
            loading={state.isLoading}
          >
            Đăng nhập
          </Button>
        </Space>
      </Form>
    </div>
  );
};
