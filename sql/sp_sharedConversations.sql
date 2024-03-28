USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

ALTER PROCEDURE sp_sharedConversations
	(
		@Activity					VARCHAR(20),
		@ReturnMsg					NVARCHAR(1000) = NULL OUT,
		@ReturnCode					CHAR(1) = NULL OUT,
		@sharedConversationID		VARCHAR(40) = NULL,
		@conversationID				VARCHAR(40) = NULL,
		@userID						VARCHAR(40) = NULL,
		@sharedCode					VARCHAR(40) = NULL,
		@fromDate					VARCHAR(20) = NULL,
		@toDate						VARCHAR(20) = NULL,
		@pageIndex					INT = 1,
		@pageSize					INT = 20
	)
	AS
		IF @Activity = 'GetDataAll'
			BEGIN
				SELECT sharedConversationID, sharedCode, conversationID, userID
				, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
				,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
				FROM tbl_sharedConversations
				WHERE 1 = 1
				AND (@sharedConversationID IS NULL OR @sharedConversationID = '' OR sharedConversationID = @sharedConversationID)
				AND (@sharedCode IS NULL OR @sharedCode = '' OR sharedCode = @sharedCode)
				AND (@userID IS NULL OR @userID = '' OR userID = @userID)
				AND (@conversationID IS NULL OR @conversationID = '' OR conversationID = @conversationID)
				AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
				AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
				ORDER BY createdAt DESC
				OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT sharedConversationID, sharedCode, conversationID, userID
					, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					FROM tbl_sharedConversations
					WHERE sharedConversationID = @sharedConversationID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_sharedConversations
				(sharedConversationID, userID, conversationID, sharedCode, createdAt)
				VALUES
				(@sharedConversationID, @userID, @conversationID, @sharedCode, GETDATE())
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_sharedConversations
				SET sharedCode = @sharedCode,
					updatedAt = GETDATE()
				WHERE conversationID = @conversationID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_sharedConversations WHERE sharedConversationID = @sharedConversationID
			END
