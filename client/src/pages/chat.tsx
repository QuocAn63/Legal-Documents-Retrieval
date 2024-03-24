import { Flex, Form, Input, InputRef } from "antd";
import styles from "../styles/chat.module.scss";
import classNames from "classnames/bind";
import { FormItem } from "react-hook-form-antd";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { chatContentValidate } from "../helpers/validates";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import MessagesContainer from "../components/message";
import { ChatService } from "../services/chat.service";
import { useLocation } from "react-router-dom";
import { useRef } from "react";

const cx = classNames.bind(styles);

const schema = z.object({
  content: chatContentValidate,
});

interface IChatInput {
  content: string;
}

interface ChatPageProps {
  isMain?: boolean;
}

export default function Chat({ isMain = false }: ChatPageProps) {
  const { control, handleSubmit, setValue } = useForm<IChatInput>({
    resolver: zodResolver(schema),
  });
  const location = useLocation();
  const [state, setState] = useState({
    isLoading: false,
    messages: [],
  });
  const chatInputRef = useRef<InputRef>(null);

  const onSubmit: SubmitHandler<IChatInput> = async (data) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      console.log(data);

      setTimeout(() => {
        clearControls();
      }, 1000);
    } catch (err: any) {
      const message = err?.message || err?.msg || err || "Error when";
      console.error(message);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    const getInitialData = async () => {
      const messagesData = await ChatService.getList_Messages("1");

      setState((prev) => ({ ...prev, messages: messagesData.data }));
    };

    getInitialData();
    initEvents();

    return () => {
      clearState();
      dropEvents();
    };
  }, [location.pathname]);

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

  const clearControls = () => {
    setValue("content", "");
  };

  const clearState = () => {
    setState({
      isLoading: false,
      messages: [],
    });
  };

  return (
    <Flex justify="center" className={cx("wrapper")}>
      <Flex justify="center" vertical className={cx("contentGroup")}>
        <div className={cx("messageContainer")}>
          {!isMain ? <MessagesContainer messages={state.messages} /> : null}
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
            ></Input>
          </FormItem>
        </Form>
      </Flex>
    </Flex>
  );
}
