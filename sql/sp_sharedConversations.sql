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
		@sharedConversationID NVARCHAR(100) = NULL,
		@conversationID NVARCHAR(100) = NULL,
		@userID NVARCHAR(100) = NULL,
		@Where NVARCHAR(1000) = NULL
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SET @sql = 'SELECT sharedConversationID, conversationID, userID, FORMAT(createdAt, ''dd/mm/yyy hh:mm'') createdAt
				,FORMAT(updatedAt, ''dd/mm/yyy hh:mm'') updatedAt
				,FORMAT(deletedAt, ''dd/mm/yyy hh:mm'') deletedAt
				FROM tbl_sharedConversations
				WHERE 1=1 ' + ISNULL(@Where, '') + ' ORDER BY createdAt DESC'

				EXECUTE(@sql)
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT sharedConversationID, conversationID, userID, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					,FORMAT(deletedAt, 'dd/mm/yyy hh:mm') deletedAt
					FROM tbl_sharedConversations
					WHERE sharedConversationID = @sharedConversationID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_sharedConversations
				(userID, conversationID)
				VALUES
				(@userID, @conversationID)
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				SET @ReturnMsg = dbo.getSysMsg('SYS_DB_MET');
				RETURN @ReturnMsg;
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_sharedConversations WHERE sharedConversationID = @sharedConversationID
			END
