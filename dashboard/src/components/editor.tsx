import { Button, Form, Input, Typography, Upload } from "antd";
import { IDocument } from "../common/interfaces/document";
import { Control, UseFormHandleSubmit } from "react-hook-form";
import { FormItem } from "react-hook-form-antd";
import { IDocumentInput } from "../pages/documents";
import TextArea from "antd/es/input/TextArea";

type EditorProps = {
  state?: "VIEW" | "UPDATE";
  document?: IDocument;
  control?: Control<IDocumentInput>;
};

const BaseDocument: IDocument = {
  id: "",
  configID: "",
  content: "",
  createdAt: "",
  label: "Label 1",
  rank: 0,
  updatedAt: "",
};

export const Editor = ({
  state = "VIEW",
  document = BaseDocument,
  control,
}: EditorProps) => {
  return state === "VIEW" ? (
    <div>
      <Typography.Title level={4}>{document.label}</Typography.Title>
      <div
        style={{ maxHeight: "80vh", overflowY: "scroll", overflowX: "hidden" }}
      >
        {document.content}
      </div>
    </div>
  ) : (
    <div>
      <Form>
        <FormItem control={control as any} name="label" label="Nhãn">
          <Input defaultValue={document.label} />
        </FormItem>
        <FormItem control={control as any} name="rank" label="Thứ tự">
          <Input style={{ width: "60px" }} defaultValue={0} />
        </FormItem>
        <Upload>
          <Button>Tải lên tài liệu</Button>
        </Upload>
        <FormItem
          control={control as any}
          name="content"
          style={{ marginTop: "8px" }}
        >
          <TextArea
            defaultValue={document.content}
            autoSize
            style={{ maxHeight: "500px" }}
          />
        </FormItem>
      </Form>
    </div>
  );
};
