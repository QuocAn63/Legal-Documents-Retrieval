USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

ALTER PROCEDURE sp_documents
	(
		@Activity		VARCHAR(20),
		@ReturnMsg		NVARCHAR(1000) = NULL OUT,
		@ReturnCode		CHAR(1) = NULL OUT,
		@configID		VARCHAR(40) = NULL,
		@documentID		VARCHAR(40) = NULL,
		@label			NVARCHAR(500) = NULL,
		@path			NVARCHAR(100) = NULL,
		@fromDate		VARCHAR(20) = NULL,
		@toDate			VARCHAR(20) = NULL,
		@pageIndex		INT = 1,
		@pageSize		INT = 20
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SELECT documentID, [label], [path]
				,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
				,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
				FROM tbl_documents
				WHERE 1 = 1
				AND (@documentID IS NULL OR @documentID = '' OR documentID = @documentID)
				AND (@label IS NULL OR @label = '' OR [label] LIKE N'''%' + @label +'%''')
				AND (@path IS NULL OR @path = '' OR [path] LIKE N'''%' + @path +'%''')
				AND (@fromDate IS NULL OR @fromDate = '' OR createdAt >= @fromDate)
				AND (@toDate IS NULL OR @toDate = '' OR createdAt <= @toDate)
				ORDER BY createdAt DESC
				OFFSET @pageSize*(@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY
				EXECUTE(@sql)
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT documentID, [label], [path]
					,FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					FROM tbl_documents
					WHERE documentID = @documentID;
			END
		ELSE
		IF @Activity = 'GetDataByConfigID'
			BEGIN
					SELECT d.*, dc.configID
					,FORMAT(d.createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(d.updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					FROM tbl_documents_config dc
					JOIN tbl_botConfigs c ON dc.configID = c.configID
					JOIN tbl_documents d ON dc.documentID = d.documentID
					WHERE dc.configID = @configID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_documents
				(documentID, [label], [path], createdAt)
				VALUES
				(@documentID, @label, @path, GETDATE())
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_documents
				SET
					[label] = @label,
					[path] = @path,
					updatedAt = GETDATE()
				WHERE documentID = @documentID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_documents WHERE documentID = @documentID
			END
