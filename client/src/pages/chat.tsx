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
import { useDispatch, useSelector } from "react-redux";

// Fake Create Conversations
import { faker } from "@faker-js/faker";
import { addConversationRedux } from "../redux/conversations";

import { IMessage } from "../interfaces/chat";
import { RootState } from "../redux/store";
import { ArrowDownOutlined } from "@ant-design/icons";

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
  isSubmitting: boolean;
  scrollToEnd: boolean;
}

export default function Chat({ isMain = false }: ChatPageProps) {
  const { control, handleSubmit, setValue } = useForm<IChatInput>({
    // resolver: zodResolver(schema),
  });
  const location = useLocation();
  const [state, setState] = useState<IChat>({
    isLoading: false,
    messages: [],
    isSubmitting: false,
    scrollToEnd: true,
  });

  // get dispatch từ redux
  const dispatch = useDispatch();

  const chatInputRef = useRef<InputRef>(null);

  const { conversationID } = useParams();

  const [check, setCheck] = useState<boolean>(false);

  // Lấy token từ store redux

  const token = useSelector((state: RootState) => state.user.user?.token);

  const navigate = useNavigate();

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationID !== undefined) {
      setCheck(true);
    } else {
      setCheck(false);
    }
  }, [conversationID]);

  useEffect(() => {
    const container = messageContainerRef.current;

    const handleScroll = () => {
      const container = messageContainerRef.current;
      if (container) {
        if (
          container.scrollTop <
          container.scrollHeight - container.clientHeight - 150
        ) {
          setState((prev) => ({
            ...prev,
            scrollToEnd: true,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            scrollToEnd: false,
          }));
        }
      }
    };
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, [messageContainerRef]);

  // Scroll xuống khi fetch message
  useEffect(() => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;

      setState((prev) => ({
        ...prev,
        lastScrollPosition: container.scrollHeight,
      }));
    }
  }, [state.messages, messageContainerRef, location.pathname]);

  // Click to Scroll To End
  const handleScrollToEnd = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setState((prev) => ({
        ...prev,
        scrollToEnd: false,
      }));
    }
  };

  const clearControls = () => {
    setValue("content", "");
  };

  const onSubmit: SubmitHandler<IChatInput> = async (data) => {
    try {
      // Add conversation vào redux store
      setState((prev) => ({
        ...prev,
        isSubmitting: true,
      }));

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
              messages: [...prev.messages, messageData],
            }));

            clearControls();
            handleReplyMessages();
          }
        } else {
          const payload = {
            conversationID: faker.string.uuid(),
            title: data.content,
            createdAt: faker.string.uuid(),
            isArchive: 0,
          };

          // Call API return summary title

          // const summaryTitle =  await summary_Title(payload.title)
          // Tham số truyền vào API
          const param = {
            title: data.content, // summaryTitle
            token: token,
          };

          const saveConversation = await ChatService.save_Conversations(param);

          const messageData: IMessage = {
            messageID: faker.string.uuid(),
            conversationID: faker.string.uuid(),
            userID: state.messages[0].userID,
            content: data.content,
            createdAt: faker.date.recent().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
            isBOT: 0,
          };

          const message = await ChatService.save_Messages(messageData);

          Promise.all([saveConversation, message]).then(
            ([saveConversationResult, saveMessageResult]) => {
              if (
                saveConversationResult.status === 200 &&
                saveMessageResult.status === 201
              ) {
                dispatch(addConversationRedux(payload));
                // setState((prev) => ({
                //   ...prev,
                //   messages: [messageData],
                // }));

                setTimeout(() => {
                  clearControls();
                  handleReplyMessages();
                  navigate(`c/${payload.conversationID}`);
                }, 200);
              }
            }
          );

          // if (saveConversation.status === 200) {
          //   dispatch(addConversationRedux(payload));
          //   setTimeout(() => {
          //     // dispatch(addConversationRedux(payload));
          //     clearControls();
          //   }, 200);
          // }

          // if (message.status === 200) {
          //   setState((prev) => ({
          //     ...prev,
          //     messages: [messageData],
          //   }));

          //   handleReplyMessages();
          // }
          // navigate(`c/${payload.conversationID}`);
        }
      } else {
        console.log("Chua nhap gi ca");
      }
    } catch (err: any) {
      const message = err?.message || err?.msg || err || "Error when";
      console.error(message);
      setState((prev) => ({ ...prev, isLoading: false }));
    } finally {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        isSubmitting: false,
      }));
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
      isSubmitting: false,
      scrollToEnd: false,
    });
  };

  return (
    <Flex justify="center" className={cx("wrapper")}>
      <Flex justify="center" vertical className={cx("contentGroup")}>
        <div
          className={cx("messageContainer")}
          ref={messageContainerRef}
          style={{ position: "relative" }}
          // onScroll={handleScroll}
        >
          {!isMain ? (
            <>
              <MessagesContainer messages={state.messages} />

              {state.scrollToEnd && (
                <Flex
                  onClick={handleScrollToEnd}
                  className={cx("btnDown")}
                  justify="center"
                  style={{
                    position: "sticky",
                    bottom: "30px",
                  }}
                >
                  <Flex
                    style={{
                      borderRadius: "360px",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      borderWidth: "2px",
                      backgroundColor: "rgb(33, 33, 33)",
                      borderStyle: "solid",
                      display: "inline-flex",
                      padding: "5px",
                    }}
                  >
                    <ArrowDownOutlined
                      style={{
                        fontSize: "20px",
                        color: "rgb(277, 277, 277)",
                        zIndex: 1,
                      }}
                    />
                  </Flex>
                </Flex>
              )}
            </>
          ) : null}
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
              disabled={state.isLoading || state.isSubmitting ? true : false}
            ></Input>
          </FormItem>
        </Form>
      </Flex>
    </Flex>
  );
}
