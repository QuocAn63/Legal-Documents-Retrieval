USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

CREATE PROCEDURE stpr_conversations
	(
		@Activity VARCHAR(20),
		@ReturnMsg NVARCHAR(1000) = NULL OUT,
		@conversationID INT = NULL,
		@userID INT = NULL,
		@title NVARCHAR(50) = NULL,
		@isArchived BIT = 0,
		@Where NVARCHAR(1000) = NULL
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SET @sql = 'SELECT conversationID, userID, title, isArchived, FORMAT(createdAt, ''dd/mm/yyy hh:mm'') createdAt
				,FORMAT(updatedAt, ''dd/mm/yyy hh:mm'') updatedAt
				,FORMAT(deletedAt, ''dd/mm/yyy hh:mm'') deletedAt
				FROM tbl_conversations
				WHERE 1=1 ' + ISNULL(@Where, '') + ' ORDER BY createdAt DESC'

				EXECUTE(@sql)
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT conversationID, userID, title, isArchived, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					,FORMAT(deletedAt, 'dd/mm/yyy hh:mm') deletedAt 
					FROM tbl_conversations
					WHERE conversationID = @conversationID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_conversations
				(userID, title, isArchived)
				VALUES
				(@userID, @title, 0)
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_conversations
				SET 
					isArchived = @isArchived
				WHERE
					conversationID = @conversationID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_conversations WHERE conversationID = @conversationID
			END
