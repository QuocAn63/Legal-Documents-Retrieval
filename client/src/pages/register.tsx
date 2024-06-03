import classNames from "classnames/bind";
import styles from "../styles/login.module.scss";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button, Form, Input, Space } from "antd";
import Title from "antd/es/typography/Title";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormItem } from "react-hook-form-antd";
import { z } from "zod";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import Paragraph from "antd/es/typography/Paragraph";
import { loginValidateObjects } from "../helpers/validates";
import useAxios from "../hooks/axios";
import { GoogleCircleFilled } from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";
import { useDispatch } from "react-redux";
import { loginRedux } from "../redux/user";

const cx = classNames.bind(styles);

const schema = z.object({
  email: loginValidateObjects.email,
  password: loginValidateObjects.password,
  passwordConfirm: loginValidateObjects.passwordConfirm,
});

export interface IRegisterInput {
  password: string;
  passwordConfirm: string;
  email: string;
}

type PageState = {
  isLoading: boolean;
  oauthURL: string;
};

export default function Register() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IRegisterInput>({
    resolver: zodResolver(schema),
  });
  const [api, contextHolder] = useMessage();
  const [state, setState] = useState<PageState>({
    isLoading: false,
    oauthURL: "",
  });
  const { instance } = useAxios();
  const authService = new AuthService(instance);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    loadInitialData();

    if (code) {
      handleGoogleLogin(code);
    }

    return clearState;
  }, []);

  const clearState = () => {
    setState({
      isLoading: false,
      oauthURL: "",
    });
  };
  const loadInitialData = async () => {
    const response = await authService.getLoginGoogleUrl();

    if (response.status === 200) {
      setState((prev) => ({
        ...prev,
        oauthURL: response.data,
      }));
    }
  };

  const onSubmit: SubmitHandler<IRegisterInput> = async (data) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const response = await authService.register(data);

      if (response.status === 201) {
        api.success(response.data);
      }
    } catch (err: any) {
      console.log(err);
      const message =
        err?.message || err?.msg || err?.data?.message || "Error when";

      setError("root", { message });
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
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
    <>
      {contextHolder}
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
              loading={state.isLoading}
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
    </>
  );
}
