import { useEffect, useState } from "react";
import { ConfigService } from "../common/services/config.service";
import { IConfig } from "../common/interfaces/config";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import { Button, Flex, Form, Input, Select, Space, Typography } from "antd";
import { FormItem } from "react-hook-form-antd";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextArea from "antd/es/input/TextArea";

const cx = classNames.bind(styles);

type BotPageState = {
  config: IConfig;
};

const schema = z.object({
  description: z.string(),
  promptContent: z.string(),
  spliited: z.boolean(),
  chunkSize: z.number(),
  chunkOverlap: z.number(),
  k: z.number(),
});

type IConfigUpdateInput = IConfig;

export const BotsPage = () => {
  const [state, setState] = useState<BotPageState>({
    config: {
      id: "",
      userID: "",
      chunkOverlap: "",
      chunkSize: "",
      createdAt: "",
      description: "",
      documents: [],
      k: "",
      promptContent: "",
      spliited: false,
      updatedAt: "",
    },
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IConfigUpdateInput>({
    resolver: zodResolver(schema),
  });
  const token = import.meta.env.VITE_AUTH_TOKEN as string;
  const configService = new ConfigService(token);

  const loadInitialData = async () => {
    try {
      const response = await configService.get_configs(
        "9DD530E3-3908-EF11-9765-7C67A2EE2BB7"
      );

      if (response.status === 200) {
        setState((prev) => ({ ...prev, config: response.data }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const clearState = () => {
    setState({
      config: {
        id: "",
        userID: "",
        chunkOverlap: "",
        chunkSize: "",
        createdAt: "",
        description: "",
        documents: [],
        k: "",
        promptContent: "",
        spliited: false,
        updatedAt: "",
      },
    });
  };

  useEffect(() => {
    loadInitialData();

    return () => {
      clearState();
    };
  }, []);

  const onSubmit: SubmitHandler<IConfigUpdateInput> = (data) => {};

  return (
    <div className={cx("wrapper")}>
      <div className={cx("section_title")}>
        <Typography.Title level={4}>Quản lý cấu hình Chatbot</Typography.Title>
      </div>
      <div className={cx("section_content")}>
        <Form onFinish={handleSubmit(onSubmit)}>
          <div>
            <FormItem
              control={control}
              name="description"
              label="Mô tả"
              labelAlign="left"
              labelCol={{ style: { width: "120px" } }}
            >
              <TextArea
                styles={{ textarea: { width: "100%" } }}
                style={{ minHeight: "100px" }}
              />
            </FormItem>
            <FormItem
              control={control}
              name="promptContent"
              label="Lời nhắc"
              labelAlign="left"
              labelCol={{ style: { width: "120px" } }}
            >
              <TextArea
                styles={{ textarea: { width: "100%" } }}
                style={{ minHeight: "100px" }}
              />
            </FormItem>
          </div>
          <Space direction="horizontal" size={"large"}>
            <FormItem
              control={control}
              name="spliited"
              label="Phân đoạn dữ liệu"
              labelAlign="left"
              labelCol={{ style: { textWrap: "wrap", width: "120px" } }}
            >
              <Select
                style={{ width: "100px" }}
                options={[
                  {
                    label: "Bật",
                    value: true,
                  },
                  {
                    label: "Tắt",
                    value: false,
                  },
                ]}
              ></Select>
            </FormItem>
            <FormItem
              control={control}
              name="chunkSize"
              label="Chunk size"
              labelAlign="left"
              labelCol={{ style: { width: "80px" } }}
            >
              <Input style={{ width: "100px" }} />
            </FormItem>
            <FormItem
              control={control}
              name="chunkOverlap"
              label="Chunk overlap"
              labelAlign="left"
              labelCol={{ style: { width: "100px" } }}
            >
              <Input style={{ width: "100px" }} />
            </FormItem>
          </Space>
          <div>
            <FormItem
              control={control}
              name="k"
              label="k"
              labelAlign="left"
              labelCol={{ style: { width: "120px" } }}
            >
              <Input style={{ width: "50px" }} />
            </FormItem>
          </div>
          <div>
            <Button className="btn-save">Cập nhật</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};
