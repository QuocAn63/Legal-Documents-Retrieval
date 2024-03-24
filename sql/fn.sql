USE [chatbot]

GO

CREATE OR ALTER FUNCTION getSysMsg(
	@sysMsgID VARCHAR(20)
)
RETURNS NVARCHAR(100)
	BEGIN
		DECLARE @msg NVARCHAR(100)
		
		SELECT @msg = content FROM tbl_systemMessages WHERE sysMsgID = @sysMsgID

		RETURN @msg;
	END