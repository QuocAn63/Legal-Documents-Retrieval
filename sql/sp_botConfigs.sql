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
		@ReturnCode CHAR(1) = NULL OUT,
		@configID NVARCHAR(40) = NULL,
		@userID NVARCHAR(40) = NULL,
		@promptContent NVARCHAR(MAX) = NULL,
		@fromDate		VARCHAR(20) = NULL,
		@toDate			VARCHAR(20) = NULL,
		@pageIndex		INT = 1,
		@pageSize		INT = 20
	)
	AS
		IF @Activity = 'GetDataAll'
			BEGIN
				SELECT configID, userID, promptContent
				,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
				,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
				FROM tbl_botConfigs
				WHERE 1 = 1
				AND (@configID IS NULL OR @configID = '' OR configID = @configID)
				AND (@userID IS NULL OR @userID = '' OR userID = @userID)
				AND (@promptContent IS NULL OR @promptContent = '' OR promptContent LIKE N'''%' + @configID + '%''')
				AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
				AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
				ORDER BY createdAt DESC
				OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT configID, userID, promptContent
					,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					FROM tbl_botConfigs
					WHERE configID = @configID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				IF NOT EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE userID = @userID AND isBOT = 1)
				BEGIN
					SET @ReturnMsg = dbo.getSysMsg('CFG_NOT_BOT');
					SET @ReturnCode = 0;
					RETURN;
				END

				INSERT INTO tbl_botConfigs(configID, userID, promptContent, createdAt)
				VALUES (@configID, @userID, @promptContent, GETDATE())
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_botConfigs
				SET 
					promptContent = @promptContent,
					userID = @userID,
					updatedAt = GETDATE()
				WHERE
					configID = @configID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_botConfigs WHERE configID = @configID
			END
