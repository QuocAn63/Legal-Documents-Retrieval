USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_conversations

ALTER PROCEDURE sp_conversations
	(
		@Activity		VARCHAR(20),
		@ReturnMsg		NVARCHAR(1000) = NULL OUT,
		@conversationID VARCHAR(20) = NULL,
		@userID			VARCHAR(20) = NULL,
		@title			NVARCHAR(50) = NULL,
		@isArchived		BIT = NULL,
		@fromDate		VARCHAR(20) = NULL,
		@toDate			VARCHAR(20) = NULL,
		@pageIndex		INT = 1,
		@pageSize		INT = 20
	)
	AS
		IF @Activity = 'GetDataAll'
			BEGIN
				SELECT conversationID, userID, title, FORMAT(createdAt, 'dd/MM/yyyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/MM/yyyy hh:mm') updatedAt, isArchived
				FROM tbl_conversations
				WHERE 1 = 1
				AND (@conversationID IS NULL OR @conversationID = '' OR conversationID = @conversationID)
				AND (@userID IS NULL OR @userID = '' OR userID = @userID)
				AND (@title IS NULL OR @title = '' OR title LIKE N'''%' + @title +'%''')
				AND (@isArchived IS NULL OR @isArchived = '' OR isArchived = @isArchived)
				AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
				AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
				ORDER BY createdAt DESC
				OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT conversationID, userID, title, isArchived, FORMAT(createdAt, 'dd/MM/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/MM/yyy hh:mm') updatedAt, isArchived
					FROM tbl_conversations
					WHERE conversationID = @conversationID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_conversations
				(conversationID, userID, title, isArchived, createdAt)
				VALUES
				(@conversationID, @userID, @title, @isArchived, GETDATE())
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_conversations
				SET 
					title = @title,
					isArchived = @isArchived,
					updatedAt = GETDATE()
				WHERE
					conversationID = @conversationID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_conversations WHERE conversationID = @conversationID
			END
