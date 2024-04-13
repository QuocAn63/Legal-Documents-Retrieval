CREATE OR ALTER PROCEDURE sp_reportReasons
(
	@Acvitity			NVARCHAR(100) = NULL,
	@ReturnMsg			NVARCHAR(1000) = NULL OUT,
	@ReturnCode			CHAR(1) = NULL OUT,
	@reasonID			VARCHAR(40) = NULL,
	@description		NVARCHAR(200) = NULL
)
AS
IF @Acvitity = 'GetDataAll'
BEGIN
	SELECT reasonID, [description]
	,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
	,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
	FROM tbl_reportReasons
	WHERE 1 = 1
	AND (@reasonID IS NULL OR @reasonID = '' OR reasonID = @reasonID)
	AND (@description IS NULL OR @description = '' OR [description] LIKE 'N''%' + @description + '%''')
END
ELSE IF @Acvitity = 'GetDataByID'
BEGIN
	SELECT reasonID, [description]
	,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
	,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
	FROM tbl_reportReasons
	WHERE reasonID = @reasonID
END
ELSE IF @Acvitity = 'Save'
BEGIN
	INSERT INTO tbl_reportReasons(reasonID, [description], createdAt)
	VALUES (@reasonID, @description, GETDATE())
END
ELSE IF @Acvitity = 'Update'
BEGIN
	UPDATE tbl_reportReasons
	SET [description] = @description,
		updatedAt = GETDATE()
	WHERE reasonID = @reasonID
END
ELSE IF @Acvitity = 'Delete'
BEGIN
	DELETE FROM tbl_reportReasons
	WHERE reasonID = @reasonID
END