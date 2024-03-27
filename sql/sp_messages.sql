USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

CREATE OR ALTER PROCEDURE sp_messages
	(
		@Activity VARCHAR(20),
		@ReturnMsg NVARCHAR(1000) = NULL OUT,
		@messageID NVARCHAR(100) = NULL,
		@conversationID NVARCHAR(100) = NULL,	
		@userID NVARCHAR(100) = NULL,
		@content NVARCHAR(MAX) = NULL,
		@isBOT BIT = 0,
		@fromDate		VARCHAR(20) = NULL,
		@toDate			VARCHAR(20) = NULL,
		@pageIndex		INT = 1,
		@pageSize		INT = 20
	)
	AS
		IF @Activity = 'GetDataAll'
			BEGIN
				SELECT messageID, conversationID, userID, content, replyToMessageID, FORMAT(createdAt, 'dd/MM/yyyy hh:mm') AS createdAt
				, FORMAT(updatedAt, 'dd/MM/yyyy hh:mm') AS updatedAt
				, isBOT
				FROM tbl_messages
				WHERE 1 = 1
				AND (@messageID IS NULL OR @messageID = '' OR messageID = @messageID)
				AND (@userID IS NULL OR @userID = '' OR userID = @userID)
				AND (@conversationID IS NULL OR @conversationID = '' OR conversationID = @conversationID)
				AND (@content IS NULL OR @content LIKE N'' OR content LIKE N'''%' + @content + '%''')
				AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
				AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
				ORDER BY createdAt DESC
				OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT messageID, conversationID, userID, content, replyToMessageID, FORMAT(createdAt, 'dd/MM/yyyy hh:mm') AS createdAt
					, FORMAT(updatedAt, 'dd/MM/yyyy hh:mm') AS updatedAt
					, isBOT
					FROM tbl_messages
					WHERE messageID = @messageID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_messages
				(userID, conversationID, content, isBOT, createdAt)
				VALUES
				(@userID, @conversationID, @content, @isBOT, GETDATE())
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_messages
				SET 
					content = @content,
					updatedAt = GETDATE()
				WHERE
					messageID = @messageID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_messages WHERE messageID = @messageID
			END
