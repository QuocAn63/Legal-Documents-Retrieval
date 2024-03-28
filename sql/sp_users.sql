USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

CREATE OR ALTER PROCEDURE sp_users
	(
		@Activity		VARCHAR(20),
		@ReturnMsg		NVARCHAR(1000) = NULL OUT,
		@ReturnCode		CHAR(1) = NULL OUT,
		@userID			VARCHAR(40) = NULL,
		@username		VARCHAR(25) = NULL,
		@password		VARCHAR(100) = NULL,
		@email			VARCHAR(50) = NULL,
		@googleID		VARCHAR(50) = NULL,
		@isBOT			BIT = 0,
		@isADMIN		BIT = 0,
		@fromDate		VARCHAR(20) = NULL,
		@toDate			VARCHAR(20) = NULL,
		@pageIndex		INT = 1,
		@pageSize		INT = 20
	)
	AS
		IF @Activity = 'GetDataAll'
			BEGIN
				SELECT userID, username, email, googleID, isBOT, isADMIN
				FROM tbl_users
				WHERE 1 = 1 
				AND (@userID IS NULL OR @userID = '' OR userID = @userID)
				AND (@username IS NULL OR @username = '' OR username = @username)
				AND (@email IS NULL OR @email = '' OR email = @email)
				AND (@isBOT IS NULL OR @isBOT = '' OR isBOT = @isBOT)
				AND (@isADMIN IS NULL OR @isADMIN = '' OR isADMIN = @isADMIN)
				AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
				AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
				ORDER BY createdAt DESC
				OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
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
						SET @ReturnCode = 0;
						RETURN;
					END

				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE email = @email)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_EML_CFL')
						SET @ReturnCode = 0;
						RETURN;
					END

				INSERT INTO tbl_users
				(userID, username, [password], email, googleID, isBOT, isADMIN)
				VALUES
				(@userID, @username, @password, @email, @googleID, @isBOT, @isADMIN)
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE email = @email AND username <> @username)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_EML_CFL')
						SET @ReturnCode = 0;
						RETURN;
					END

				IF EXISTS (SELECT TOP 1 1 FROM tbl_users WHERE [password] = @password)
					BEGIN
						SET @ReturnMsg = dbo.getSysMsg('USR_PWD_EQL')
						SET @ReturnCode = 0;
						RETURN;
					END

				UPDATE tbl_users
				SET 
					email = @email,
					[password] = @password,
					isBOT = @isBOT,
					isADMIN = @isADMIN
				WHERE
					userID = @userID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_users WHERE userID = @userID AND isBOT = 0 -- Can not delete ADMIN account
			END
