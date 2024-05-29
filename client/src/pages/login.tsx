import classNames from "classnames/bind";
import styles from "../styles/login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import AuthService from "../services/auth.service";
import { Button, Form, Input, Space } from "antd";
import Title from "antd/es/typography/Title";
import { FormItem } from "react-hook-form-antd";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
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

type StateProps = {
  isLoading: boolean;
  oauthURL: string;
};

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

  const [state, setState] = useState<StateProps>({
    isLoading: false,
    oauthURL: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { instance } = useAxios();
  const authService = new AuthService(instance);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    loadInitialData();

    if (code) {
      handleGoogleLogin(code);
    }

    return clearState;
  }, []);

  const loadInitialData = async () => {
    const response = await authService.getLoginGoogleUrl();

    if (response.status === 200) {
      setState((prev) => ({
        ...prev,
        oauthURL: response.data,
      }));
    }
  };

  const clearState = () => {
    setState({
      isLoading: false,
      oauthURL: "",
    });
  };

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

  const onGoogleLoginClick = () => {
    try {
      window.open(state.oauthURL, "_self");
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = async (code: string) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await authService.googleLogin(code);

      if (response.status === 201 || response.status === 200) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
        }));
        dispatch(loginRedux(response.data));
        navigate("/", { replace: true });
      }
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));
      setError("root", { message: "Đăng nhập không thành công" });
    }
  };

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
            loading={state.isLoading}
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
          onClick={onGoogleLoginClick}
        >
          Đăng nhập bằng Google
        </Button>
      </div>
    </div>
  );
}
