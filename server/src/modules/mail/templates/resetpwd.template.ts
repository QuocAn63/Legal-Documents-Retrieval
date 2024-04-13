export const resetPwdEmailTemplate = `<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width" />
</head>
<body
style="
  -moz-box-sizing: border-box;
  -ms-text-size-adjust: 100%;
  -webkit-box-sizing: border-box;
  -webkit-text-size-adjust: 100%;
  box-sizing: border-box;
  color: #1c232b;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 16px;
  font-weight: normal;
  line-height: 22px;
  margin: 0;
  min-width: 100%;
  padding: 0;
  text-align: left;
  width: 100% !important;
"
>
<table
  bgcolor="#fdfdfd"
  style="
    box-sizing: border-box;
    border-spacing: 0;
    width: 100%;
    background-color: #fdfdfd;
    border-collapse: separate !important;
  "
  width="100%"
>
  <div style="text-align: center">
    <p style="font-size: 24px">Bạn đã yêu cầu tính năng reset mật khẩu</p>
    <a style="font-size: 40px; margin-top: 20px" href="http://localhost:3001/resetpwd?token=[TOKEN]"
      >Click vào đây để đến trang reset mật khẩu.</a
    >
  </div>
</table>
</body>
;
`;
