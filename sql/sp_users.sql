USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

ALTER PROCEDURE stpr_users
	(
		@Activity VARCHAR(20),
		@ReturnMsg NVARCHAR(1000) = NULL OUT,
		@userID INT = NULL,
		@username VARCHAR(25) = NULL,
		@password VARCHAR(100) = NULL,
		@email VARCHAR(50) = NULL,
		@googleID VARCHAR(50) = NULL,
		@facebookID VARCHAR(50) = NULL,
		@Order NVARCHAR(100) = NULL,
		@Where NVARCHAR(1000) = NULL
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SET @sql = 'SELECT userID, username, email, FORMAT(createdAt, ''dd/mm/yyy hh:mm'') createdAt
				,FORMAT(updatedAt, ''dd/mm/yyy hh:mm'') updatedAt
				,FORMAT(deletedAt, ''dd/mm/yyy hh:mm'') deletedAt
				FROM tbl_users
				WHERE 1=1 ' + ISNULL(@Where, '') + ' ORDER BY createdAt DESC'

				EXECUTE(@sql)
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT userID, username, email, FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					,FORMAT(deletedAt, 'dd/mm/yyy hh:mm') deletedAt 
					FROM tbl_users
					WHERE userID = @userID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE username = @username)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_UN_CFL')
						RETURN @ReturnMsg;
					END

				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE email = @email)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_EML_CFL')
						RETURN @ReturnMsg;
					END

				INSERT INTO tbl_users
				(username, [password], email)
				VALUES
				(@username, @password, @email)
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE email = @email)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_EML_CFL')
						RETURN @ReturnMsg;
					END

				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE [password] = @password)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_PWD_EQL')
						RETURN @ReturnMsg;
					END

				UPDATE tbl_users
				SET 
					email = @email,
					[password] = @password
				WHERE
					userID = @userID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_users WHERE userID = @userID AND isBOT = 0
			END