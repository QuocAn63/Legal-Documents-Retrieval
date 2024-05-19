import { Flex, Form, Input, InputRef, Spin } from "antd";
import styles from "../styles/chat.module.scss";
import classNames from "classnames/bind";
import { FormItem } from "react-hook-form-antd";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import MessagesContainer from "../components/message";
import { ChatService } from "../services/chat.service";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { IMessage } from "../interfaces/chat";
import { ArrowDownOutlined } from "@ant-design/icons";
import useAxios from "../hooks/axios";

const cx = classNames.bind(styles);

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
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
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
    pagination: {
      pageIndex: 1,
      pageSize: 10,
    },
  });
  const chatInputRef = useRef<InputRef>(null);
  const { conversationID } = useParams();
  const [check, setCheck] = useState<boolean>(false);

  // Lấy token từ store redux
  const { instance } = useAxios();
  const chatService = new ChatService(instance);
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
        const response = await chatService.invoke(data.content, conversationID);

        if (response.status === 201) {
          if (check) {
            setState((prev) => ({
              ...prev,
              pagination: {
                ...prev.pagination,
                pageSize: prev.pagination.pageSize + 2,
              },
            }));
            clearControls();
          } else {
            navigate(`/c/${response.data.conversationID}`);
          }
        } else navigate("/");
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

  const getInitialData = async () => {
    if (conversationID) {
      const messagesData = await chatService.getList_Messages(
        conversationID,
        state.pagination
      );

      setState((prev) => ({ ...prev, messages: messagesData.data.messages }));
    }
  };
  useEffect(() => {
    clearControls();
    getInitialData();
    initEvents();

    return () => {
      clearState();
      dropEvents();
    };
  }, [location.pathname, state.pagination.pageSize, conversationID]);

  const clearState = () => {
    setState({
      isLoading: false,
      isSubmitting: false,
      messages: [],
      pagination: {
        pageIndex: 1,
        pageSize: 20,
      },
      scrollToEnd: true,
    });
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
