import { Typography } from "antd";
import { IDocument } from "../../common/interfaces/document";

type ComponentProps = {
  document: IDocument;
};

export const ViewDocument = ({ document }: ComponentProps) => {
  return (
    <div>
      <Typography.Title level={4}>{document.label}</Typography.Title>
      <div
        style={{ maxHeight: "80vh", overflowY: "scroll", overflowX: "hidden" }}
      >
        {document.content}
      </div>
    </div>
  );
};
