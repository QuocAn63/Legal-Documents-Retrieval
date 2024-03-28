CREATE OR ALTER PROCEDURE sp_reports
(
	@Acvitity			NVARCHAR(100) = NULL,
	@ReturnMsg			NVARCHAR(1000) = NULL OUT,
	@ReturnCode			CHAR(1) = NULL OUT,
	@reportID			VARCHAR(40) = NULL,
	@userID				VARCHAR(40) = NULL,
	@description		NVARCHAR(200) = NULL,
	@reasonID			VARCHAR(40) = NULL,
	@messageID			VARCHAR(40) = NULL,
	@status				CHAR(1) = NULL,
	@fromDate		VARCHAR(20) = NULL,
	@toDate			VARCHAR(20) = NULL,
	@pageIndex		INT = 1,
	@pageSize		INT = 20
)
AS
IF @Acvitity = 'GetDataAll'
BEGIN
	SELECT reportID, userID, [description], messageId, reasonID, [status]
	,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
	,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
	FROM tbl_reports
	WHERE 1 = 1
	AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
	AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
	ORDER BY createdAt DESC
	OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
END
ELSE IF @Acvitity = 'GetDataByID'
BEGIN
	SELECT reportID, userID, [description], messageId, reasonID, [status]
	,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
	,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
	FROM tbl_reports
	WHERE reportID = @reportID
END
ELSE IF @Acvitity = 'Save'
BEGIN
	INSERT INTO tbl_reports(reportID, userID, messageID, reasonID, [description], [status], createdAt)
	VALUES (@reportID, @userID, @messageID, @reasonID, @description, 0, GETDATE())
END
ELSE IF @Acvitity = 'Update'
BEGIN
	UPDATE tbl_reports
	SET [status] = @status
	WHERE reportID = @reportID
END
ELSE IF @Acvitity = 'Delete'
BEGIN
	DELETE FROM tbl_reports
	WHERE reportID = @reportID
END