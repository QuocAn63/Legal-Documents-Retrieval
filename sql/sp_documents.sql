USE [chatbot]

GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- sp_users

CREATE PROCEDURE stpr_documents
	(
		@Activity VARCHAR(20),
		@ReturnMsg NVARCHAR(1000) = NULL OUT,
		@documentID NVARCHAR(100) = NULL,
		@label NVARCHAR(500) = NULL,
		@path NVARCHAR(100) = NULL,
		@Where NVARCHAR(1000) = NULL
	)
	AS
		DECLARE @sql NVARCHAR(1000) = '';

		IF @Activity = 'GetDataAll'
			BEGIN
				SET @sql = 'SELECT documentID, label, path, FORMAT(createdAt, ''dd/mm/yyy hh:mm'') createdAt
				,FORMAT(updatedAt, ''dd/mm/yyy hh:mm'') updatedAt
				FROM tbl_documents
				WHERE 1=1 ' + ISNULL(@Where, '') + ' ORDER BY createdAt DESC'

				EXECUTE(@sql)
			END
		ELSE  
		IF @Activity = 'GetDataByID'
			BEGIN
					SELECT documentID, [label], [path], FORMAT(createdAt, 'dd/mm/yyy hh:mm') createdAt
					,FORMAT(updatedAt, 'dd/mm/yyy hh:mm') updatedAt
					FROM tbl_documents
					WHERE documentID = @documentID;
			END
		ELSE
		IF @Activity = 'Save'
			BEGIN
				INSERT INTO tbl_documents
				([label], [path])
				VALUES
				(@label, @path)
			END
		ELSE
		IF @Activity = 'Update'
			BEGIN
				UPDATE tbl_documents
				SET
					[label] = @label,
					[path] = @path
				WHERE documentID = @documentID
			END
		ELSE
		IF @Activity = 'Delete'
			BEGIN
				DELETE FROM tbl_documents WHERE documentID = @documentID
			END
