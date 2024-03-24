USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

CREATE PROCEDURE stpr_messages
	(
		@Activity VARCHAR(20),
		@ReturnMsg NVARCHAR(1000) = NULL OUT,
		@messageID NVARCHAR(100) = NULL,
		@conversationID NVARCHAR(100) = NULL,
		@userID NVARCHAR(100) = NULL,
		@content TEXT = NULL,
		@isBOT BIT = 0,
		@Where NVARCHAR(1000) = NULL
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SET @sql = 'SELECT messageID, conversationID, userID, content, isBOT, FORMAT(createdAt, ''dd/mm/yyy hh:mm'') createdAt
				,FORMAT(updatedAt, ''dd/mm/yyy hh:mm'') updatedAt
				,FORMAT(deletedAt, ''dd/mm/yyy hh:mm'') deletedAt
				FROM tbl_messages
				WHERE 1=1 ' + ISNULL(@Where, '') + ' ORDER BY createdAt DESC'

				EXECUTE(@sql)
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT messageID, conversationID, userID, content, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					,FORMAT(deletedAt, 'dd/mm/yyy hh:mm') deletedAt,
					isBOT
					FROM tbl_messages
					WHERE messageID = @messageID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_messages
				(userID, conversationID, content, isBOT)
				VALUES
				(@userID, @conversationID, @content, @isBOT)
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
