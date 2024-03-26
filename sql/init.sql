BEGIN
CREATE DATABASE [chatbot];
END

GO

USE [chatbot];

GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_users')
	BEGIN
		CREATE TABLE tbl_users (
			userID			VARCHAR(20) NOT NULL,
			username		VARCHAR(25) NOT NULL,
			[password]		VARCHAR(100) NOT NULL,
			email			VARCHAR(50),
			googleID		VARCHAR(50),
			createdAt		DATETIME DEFAULT GETDATE(),
			updatedAt		DATETIME,
			deletedAt		DATETIME,
			isBOT			BIT,
			isADMIN			BIT
		);

		ALTER TABLE tbl_users
		ADD CONSTRAINT users_pk PRIMARY KEY(userID);
	END;
		
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_conversations')
	BEGIN
	CREATE TABLE tbl_conversations (
		conversationID		VARCHAR(20) NOT NULL,
		userID				VARCHAR(20) NOT NULL,
		title				NVARCHAR(50),
		createdAt			DATETIME DEFAULT GETDATE(),
		updatedAt			DATETIME,
		isArchived			BIT DEFAULT 0
	);
		
	ALTER TABLE tbl_conversations
	ADD CONSTRAINT conversations_pk PRIMARY KEY(conversationID);

	ALTER TABLE tbl_conversations
	ADD CONSTRAINT conversations_userID_fk FOREIGN KEY(userID) REFERENCES tbl_users(userID);
	END;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_messages')
	BEGIN
	CREATE TABLE tbl_messages(
		messageID			VARCHAR(20) NOT NULL,
		userID				VARCHAR(20) NOT NULL,
		conversationID		VARCHAR(20) NOT NULL,
		content				NVARCHAR(MAX),
		createdAt			DATETIME DEFAULT GETDATE(),
		updatedAt			DATETIME,
		isBOT				BIT
	)

	ALTER TABLE tbl_messages
	ADD CONSTRAINT messages_pk PRIMARY KEY(messageID)

	ALTER TABLE tbl_messages
	ADD CONSTRAINT messages_userID FOREIGN KEY(userID) REFERENCES tbl_users(userID)

	ALTER TABLE tbl_messages
	ADD CONSTRAINT messages_conversationID FOREIGN KEY(conversationID) REFERENCES tbl_conversations(conversationID)
	END

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_sharedConversations')
	BEGIN
	CREATE TABLE tbl_sharedConversations(
		sharedConversationID	VARCHAR(20) NOT NULL,
		userID					VARCHAR(20) NOT NULL,
		conversationID			VARCHAR(20) NOT NULL,
		sharedCode				VARCHAR(20),
		createdAt DATETIME DEFAULT GETDATE(),
		updatedAt DATETIME
	)

	ALTER TABLE tbl_sharedConversations
	ADD CONSTRAINT sharedConversations_pk PRIMARY KEY(sharedConversationID)

	ALTER TABLE tbl_sharedConversations
	ADD CONSTRAINT sharedConversations_userID FOREIGN KEY(userID) REFERENCES tbl_users(userID)

	ALTER TABLE tbl_sharedConversations
	ADD CONSTRAINT sharedConversations_conversationID FOREIGN KEY(conversationID) REFERENCES tbl_conversations(conversationID)
	END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_systemMessages')
	BEGIN
		CREATE TABLE tbl_systemMessages(
			sysMsgID VARCHAR(20) NOT NULL,
			content NVARCHAR(100) NOT NULL	
		);

		ALTER TABLE tbl_systemMessages
		ADD CONSTRAINT systemMessages_pk PRIMARY KEY(sysMsgID)
	END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_botConfigs')
	BEGIN
		CREATE TABLE tbl_botConfigs(
			configID		VARCHAR(20) NOT NULL,
			userID			VARCHAR(20) NOT NULL,
			promptContent	NVARCHAR(MAX) NOT NULL,
			createdAt		DATETIME DEFAULT GETDATE(),
			updatedAt		DATETIME
		);

		ALTER TABLE tbl_botConfigs
		ADD CONSTRAINT botConfigs_pk PRIMARY KEY(configID)
	END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_documents')
	BEGIN
		CREATE TABLE tbl_documents(
			documentID		VARCHAR(20) NOT NULL,
			[label]			NVARCHAR(500) NOT NULL,
			[path]			VARCHAR(200) NOT NULL,
			createdAt DATETIME DEFAULT GETDATE(),
			updatedAt DATETIME
		);

		ALTER TABLE tbl_documents
		ADD CONSTRAINT documents_pk PRIMARY KEY(documentID)
	END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_documents_config')
	BEGIN
		CREATE TABLE tbl_documents_config(
			documentID		VARCHAR(20) NOT NULL,
			configID		VARCHAR(20) NOT NULL
		);

		ALTER TABLE tbl_documents_config
		ADD CONSTRAINT documents_config_pk PRIMARY KEY(documentID, configID)
		
		ALTER TABLE tbl_documents_config
		ADD CONSTRAINT documents_config_documentID_fk FOREIGN KEY(documentID) REFERENCES tbl_documents(documentID)
		
		ALTER TABLE tbl_documents_config
		ADD CONSTRAINT documents_config_configID_fk FOREIGN KEY(configID) REFERENCES tbl_botConfigs(configID)
	END