import { useDispatch } from "react-redux";
import { logOutRedux } from "../redux/user";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const LogoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  dispatch(logOutRedux());

  useEffect(() => {
    navigate("/login", { replace: true });
  }, []);
  return <></>;
};
