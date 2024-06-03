import { Button, Form, Input, Upload, UploadProps } from "antd";
import { IDocument } from "../../common/interfaces/document";
import { Control, UseFormSetValue } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import TextArea from "antd/es/input/TextArea";
import { z } from "zod";
import { UploadOutlined } from "@ant-design/icons";
import { ShowMessagesFromError } from "../../common/helpers/GetMessageFromError";
import useMessage from "antd/es/message/useMessage";
import useAxios from "../../common/hooks/axios";
import { DocumentService } from "../../common/services/document.service";
import { useEffect } from "react";

export type IUpdateDocumentProps = {
  label: string;
  rank: string;
  content: string;
};

export const updateSchema = z.object({
  label: z.string().max(200, "Nhãn không hợp lệ"),
  rank: z.any().default(0),
  content: z.string(),
});

type ComponentProps = {
  document: IDocument;
  control: Control<IUpdateDocumentProps>;
  setValue: UseFormSetValue<IUpdateDocumentProps>;
};

export const UpdateDocument = ({
  document,
  control,
  setValue,
}: ComponentProps) => {
  const [api, contextHolder] = useMessage();

  const { instance } = useAxios();
  const documentService = new DocumentService(instance);

  const props: UploadProps = {
    beforeUpload: async (file) => {
      const formData = new FormData();

      formData.append("file", file);

      try {
        const response = await documentService.extract_documents(formData);
        if (response.status === 201) {
          setValue("content", response.data);
        }
      } catch (err) {
        ShowMessagesFromError(err, api);
      } finally {
      }

      return false;
    },
  };

  useEffect(() => {
    Object.keys(document).forEach((key: any) =>
      setValue(key, document[key as keyof IDocument])
    );
  }, [document]);

  return (
    <>
      {contextHolder}
      <Form>
        <FormItem control={control} name="label" label="Nhãn">
          <Input />
        </FormItem>
        <FormItem control={control} name="rank" label="Thứ tự">
          <Input style={{ width: "60px" }} type="number" min={0} />
        </FormItem>
        <Upload {...props} accept="application/pdf" maxCount={1}>
          <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
        </Upload>
        <FormItem
          control={control as any}
          name="content"
          style={{ marginTop: "8px" }}
        >
          <TextArea
            autoSize
            style={{ minHeight: "380px", maxHeight: "500px" }}
          />
        </FormItem>
      </Form>
    </>
  );
};
