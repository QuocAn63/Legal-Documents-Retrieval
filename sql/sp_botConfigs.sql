USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

CREATE PROCEDURE stpr_botConfigs
	(
		@Activity VARCHAR(20),
		@ReturnMsg NVARCHAR(1000) = NULL OUT,
		@userID NVARCHAR(100) = NULL,
		@promptContent NVARCHAR(500) = NULL,
		@Where NVARCHAR(1000) = NULL
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SET @ReturnMsg = dbo.getSysMsg('SYS_DB_MET');
				RETURN @ReturnMsg;
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT userID, promptContent, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					FROM tbl_botConfigs
					WHERE userID = @userID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				SET @ReturnMsg = dbo.getSysMsg('SYS_DB_MET');
				RETURN @ReturnMsg;
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_botConfigs
				SET 
					promptContent = @promptContent,
					updatedAt = GETDATE()
				WHERE
					userID = @userID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_botConfigs WHERE userID = @userID
			END
