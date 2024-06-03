import { useEffect, useState } from "react";
import { ConfigService } from "../common/services/config.service";
import { IConfig, IUpdateConfig } from "../common/interfaces/config";
import styles from "../styles/manage.module.scss";
import classNames from "classnames/bind";
import { Button, Form, Input, Select, Space, Typography } from "antd";
import { FormItem } from "react-hook-form-antd";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TextArea from "antd/es/input/TextArea";
import useAxios from "../common/hooks/axios";
import useMessage from "antd/es/message/useMessage";
import { ShowMessagesFromError } from "../common/helpers/GetMessageFromError";

const cx = classNames.bind(styles);

type BotPageState = {
  config: IConfig;
  showSplitFields: boolean;
};

const schema = z.object({
  description: z.string(),
  promptContent: z.string(),
  splitted: z.boolean(),
  chunkSize: z.any().optional(),
  chunkOverlap: z.any().optional(),
  k: z.any(),
});

type IConfigUpdateInput = {
  description: string;
  promptContent: string;
  splitted: boolean;
  chunkSize: string;
  chunkOverlap: string;
  k: string;
};

export const BotsPage = () => {
  const [api, contextHolder] = useMessage();
  const [state, setState] = useState<BotPageState>({
    config: {
      id: "",
      userID: "",
      chunkOverlap: 0,
      chunkSize: 0,
      createdAt: "",
      description: "",
      documents: [],
      k: 0,
      promptContent: "",
      splitted: true,
      updatedAt: "",
    },
    showSplitFields: false,
  });
  const { control, handleSubmit, setValue } = useForm<IConfigUpdateInput>({
    resolver: zodResolver(schema),
  });
  const { instance } = useAxios();
  const configService = new ConfigService(instance);

  const loadInitialData = async () => {
    try {
      const response = await configService.get_configs(
        "45C6BE2C-EE1F-EF11-B3C3-E0D464DFA281"
      );

      if (response.status === 200) {
        setState((prev) => ({
          ...prev,
          config: response.data,
          showSplitFields: response.data.splitted,
        }));

        Object.keys(response.data).forEach((key: any) => {
          if (key === "splitted") {
            setValue(key, response.data[key] ? true : false);
          }
          if (key === "promptContent") {
            setValue(key, response.data[key]);
          } else {
            setValue(key, response.data[key]);
          }
        });
      }
    } catch (err: any) {
      ShowMessagesFromError(err, api);
    }
  };

  const clearState = () => {
    setState({
      config: {
        id: "",
        userID: "",
        chunkOverlap: 0,
        chunkSize: 0,
        createdAt: "",
        description: "",
        documents: [],
        k: 0,
        promptContent: "",
        splitted: true,
        updatedAt: "",
      },
      showSplitFields: false,
    });
  };

  useEffect(() => {
    loadInitialData();

    return () => {
      clearState();
    };
  }, []);

  const onSubmit: SubmitHandler<IConfigUpdateInput> = async (data) => {
    const formattedData: IUpdateConfig = {
      ...data,
      promptContent: JSON.stringify(data.promptContent),
      userID: "6B2F904D-301C-EF11-B3C2-E0D464DFA281",
      configID: "45C6BE2C-EE1F-EF11-B3C3-E0D464DFA281",
      chunkSize: Number.parseInt(data.chunkSize),
      chunkOverlap: Number.parseInt(data.chunkOverlap),
      k: Number.parseInt(data.k),
    };

    try {
      const response = await configService.update_configs(formattedData);

      if (response.status === 200) {
        await loadInitialData();
        api.success(response.message);
      }
    } catch (err: any) {
      ShowMessagesFromError(err, api);
    }
  };

  return (
    <>
      {contextHolder}
      <div className={cx("wrapper")}>
        <div className={cx("section_title")}>
          <Typography.Title level={4}>
            Quản lý cấu hình Chatbot
          </Typography.Title>
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
                  style={{ minHeight: "380px" }}
                />
              </FormItem>
            </div>
            <Space direction="horizontal" size={"large"}>
              <FormItem
                control={control}
                name="splitted"
                label="Phân đoạn dữ liệu"
                labelAlign="left"
                labelCol={{ style: { textWrap: "wrap", width: "120px" } }}
              >
                <Select
                  style={{ width: "100px" }}
                  onChange={(field) => {
                    setState((prev) => ({
                      ...prev,
                      showSplitFields: field,
                    }));
                  }}
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
                label="Kích thước đoạn"
                labelAlign="left"
                disabled={!state.showSplitFields}
              >
                <Input style={{ width: "100px" }} type="number" />
              </FormItem>
              <FormItem
                control={control}
                name="chunkOverlap"
                label="Số đoạn trùng"
                labelAlign="left"
                disabled={!state.showSplitFields}
              >
                <Input style={{ width: "100px" }} type="number" />
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
                <Input
                  style={{ width: "80px" }}
                  type="number"
                  onChange={(e) => {
                    console.log(typeof e.target.value);
                  }}
                />
              </FormItem>
            </div>
            <div>
              <Button className="btn-save" htmlType="submit">
                Cập nhật
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};
