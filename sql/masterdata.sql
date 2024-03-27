INSERT INTO tbl_users(userID, username, [password], isBOT, isADMIN)
VALUES
('8df4d737-869b-44a7-8b3c-cd0cddfed815', 'admin', '$2y$10$1aKaJNmfkSZmxgp9uGiHDe9r.9dBocl5PcJWH8Hz9suvJ0TOnuLKy', 0,1);

INSERT INTO tbl_systemMessages(sysMsgID, content)
VALUES
('ID_NOTFOUND',	N'Không tìm thấy mã'),
('USR_UN_CFL',	N'Tên tài khoản đã tồn tại'),
('USR_EML_CFL',	N'Email đã tồn tại'),
('USR_PWD_EQL',	N'Mật khẩu trùng'),
('SYS_DB_MET',	N'Không thể thực hiện phương thức này')
