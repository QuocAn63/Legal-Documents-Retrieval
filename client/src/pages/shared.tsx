import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ISharedConversation2 } from "../interfaces/shared";
import SharedService from "../services/shared.service";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Col, Flex, Row, Typography } from "antd";
import styles from "../styles/shared.module.scss";
import classNames from "classnames/bind";
import MessagesContainer from "../components/message";
import { IMessage } from "../interfaces/chat";

const cx = classNames.bind(styles);

type SharedPageProps = {
  sharedConversation: ISharedConversation2;
};

export const SharedPage = () => {
  const { sharedCode } = useParams();
  const [state, setState] = useState<SharedPageProps>({
    sharedConversation: {
      conversation: {
        createdAt: "",
        id: "",
        isArchived: 0,
        title: "",
      },
      conversationID: "",
      createdAt: "",
      id: "",
      messages: [],
      sharedCode: "",
      userID: "",
    },
  });
  const navigate = useNavigate();
  const token = useSelector((state: RootState) => state.user.user?.token);

  const sharedService = new SharedService(token);
  const loadInitialData = async () => {
    if (sharedCode) {
      const response = (await sharedService.get_shared(sharedCode)) as any;

      if (response.status === 200) {
        setState((prev) => ({ ...prev, sharedConversation: response.data }));
      } else {
        navigate("/404", {
          replace: true,
        });
      }
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [sharedCode]);

  return (
    <Row>
      <Col span={24}>
        <Flex align="center" vertical>
          <div className={cx("wrapper")}>
            <div className={cx("header")}>
              <Typography.Title level={2}>
                {state.sharedConversation?.conversation.title}
              </Typography.Title>
              <Typography.Paragraph className={cx("createTime")}>
                {state.sharedConversation?.createdAt}
              </Typography.Paragraph>
            </div>
            <div className="horizontal"></div>
            <MessagesContainer
              messages={state.sharedConversation?.messages as IMessage[] | []}
              preview={true}
            ></MessagesContainer>
          </div>
        </Flex>
      </Col>
    </Row>
  );
};
