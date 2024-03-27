use [chatbot]

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

INSERT INTO tbl_conversations
(conversationID, userID, title, isArchived)
VALUES
('989f9295-5199-46f4-8467-181dc6047b15', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 1', 0),
('bd263b96-1277-43c6-a1da-ce973b29ffb4', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 2', 0),
('c0b415a5-6c6c-4791-8702-a2ca5dacdffe', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 3', 0),
('6dfd86fe-1c16-4bae-a61d-fab233511bc4', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 4', 0),
('138ac88e-5aac-49c9-bc4c-b327b4d35049', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 5', 0),
('b382b21e-e3f8-4fab-a2d3-3cfb8f857483', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 6', 0),
('47eddf85-6052-4f08-8193-f7f7d0a8ac1d', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 7', 0),
('c61fd86e-6e4a-420e-8504-e28ca0191b74', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 8', 0),
('dc5b4e61-0d61-45b2-b7c5-e4d1764c9a98', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 9', 0),
('852ac877-418f-4847-81c8-08285fa58d60', '8df4d737-869b-44a7-8b3c-cd0cddfed815', 'Title 10', 0)