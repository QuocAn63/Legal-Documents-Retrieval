import { Flex, Form, Input, InputRef, Spin } from "antd";
import styles from "../styles/chat.module.scss";
import classNames from "classnames/bind";
import { FormItem } from "react-hook-form-antd";
import { SubmitHandler, useForm } from "react-hook-form";
// import { z } from "zod";
// import { chatContentValidate } from "../helpers/validates";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import MessagesContainer from "../components/message";
import { ChatService } from "../services/chat.service";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useDispatch } from "react-redux";

// Fake Create Conversations
import { faker } from "@faker-js/faker";
import { addConversationRedux } from "../redux/conversations";

import { IMessage } from "../interfaces/chat";

// Validate

const cx = classNames.bind(styles);

// const schema = z.object({
//   content: chatContentValidate.content,
// });

interface IChatInput {
  content: string;
}

interface ChatPageProps {
  isMain?: boolean;
}

interface IChat {
  isLoading: boolean;
  messages: IMessage[];
  reply: IMessage[];
}

export default function Chat({ isMain = false }: ChatPageProps) {
  const { control, handleSubmit, setValue } = useForm<IChatInput>({
    // resolver: zodResolver(schema),
  });
  const location = useLocation();
  const [state, setState] = useState<IChat>({
    isLoading: false,
    messages: [],
    reply: [],
  });

  // get dispatch từ redux
  const dispatch = useDispatch();

  const chatInputRef = useRef<InputRef>(null);

  const { conversationID } = useParams();

  const [check, setCheck] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (conversationID !== undefined) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [conversationID]);

  const clearControls = () => {
    setValue("content", "");
  };

  const onSubmit: SubmitHandler<IChatInput> = async (data) => {
    try {
      // Add conversation vào redux store

      if (data.content !== "") {
        if (check === true) {
          const messageData: IMessage = {
            messageID: faker.string.uuid(),
            conversationID: conversationID as string,
            userID: state.messages[0].userID,
            content: data.content,
            createdAt: faker.date.recent().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
            isBOT: 0,
          };

          const message = await ChatService.save_Messages(messageData);

          if (message.status === 201) {
            setState((prev) => ({
              ...prev,
              // isLoading: false,
              messages: [...prev.messages, messageData],
            }));
            setTimeout(() => {
              clearControls();
              handleReplyMessages();
            }, 500);
          }
        } else {
          const payload = {
            conversationID: faker.string.uuid(),
            title: data.content,
            createdAt: faker.string.uuid(),
            isArchive: 0,
          };

          dispatch(addConversationRedux(payload));
          setTimeout(() => {
            // dispatch(addConversationRedux(payload));
            clearControls();
            navigate(`c/${payload.conversationID}`);
          }, 500);
        }
      } else {
        console.log("Chua nhap gi ca");
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || err || "Error when";
      console.error(message);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    const getInitialData = async () => {
      console.log("Fetch Again");

      const messagesData = await ChatService.getList_Messages("1");

      console.log(messagesData.data);

      setState((prev) => ({ ...prev, messages: messagesData.data }));
    };

    getInitialData();
    initEvents();

    return () => {
      clearState();
      dropEvents();
    };
  }, [location.pathname]);

  const handleReplyMessages = async () => {
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));
    const replyMessage = await ChatService.getReply_Messages(
      conversationID as string
      // ConversationID
      // UserToken
    );
    console.log(replyMessage.data);

    if (replyMessage.status === 200) {
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, replyMessage.data],
        isLoading: false,
      }));
    }
  };

  const bindEnterToSubmit = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(onSubmit);
    }
  };

  const bindFocusEventOnInput = () => {
    document.addEventListener("keypress", bindEnterToSubmit);
  };

  const initEvents = () => {
    if (chatInputRef.current && chatInputRef.current.input) {
      chatInputRef.current.input.addEventListener(
        "focus",
        bindFocusEventOnInput
      );
    }
  };

  const dropEvents = () => {
    if (chatInputRef.current && chatInputRef.current.input) {
      chatInputRef.current.input.removeEventListener(
        "focus",
        bindFocusEventOnInput
      );
      document.removeEventListener("keypress", bindEnterToSubmit);
    }
  };

  const clearState = () => {
    setState({
      isLoading: false,
      messages: [],
      reply: [],
    });
  };

  return (
    <Flex justify="center" className={cx("wrapper")}>
      <Flex justify="center" vertical className={cx("contentGroup")}>
        <div className={cx("messageContainer")}>
          {!isMain ? <MessagesContainer messages={state.messages} /> : null}
          {state.isLoading && (
            <Flex justify="center" className={cx("wrapSpin")}>
              <Spin className={cx("spin")} />
            </Flex>
          )}
        </div>
        <Form onFinish={handleSubmit(onSubmit)}>
          <FormItem control={control} name="content">
            <Input
              autoComplete="off"
              id="content"
              variant="outlined"
              placeholder="Hỏi gì đó đi..."
              className={cx("textBox")}
              ref={chatInputRef}
              autoFocus
              disabled={state.isLoading ? true : false}
            ></Input>
          </FormItem>
        </Form>
      </Flex>
    </Flex>
  );
}
