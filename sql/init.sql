USE [chatbot];

GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_users')
	BEGIN
		CREATE TABLE tbl_users (
			userID INT not null IDENTITY (1,1),
			username VARCHAR(25) not null,
			[password] VARCHAR(100) not null,
			email VARCHAR(50),
			googleID VARCHAR(50),
			facebookID VARCHAR(50),
			createdAt DATETIME DEFAULT GETDATE(),
			updatedAt DATETIME,
			deletedAt DATETIME
		);

		ALTER TABLE tbl_users
		ADD CONSTRAINT users_pk PRIMARY KEY(userID);
	END;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_conversations')
	BEGIN
	CREATE TABLE tbl_conversations (
		conversationID INT IDENTITY (1,1),
		userID INT NOT NULL,
		title NVARCHAR(50),
		createdAt DATETIME DEFAULT GETDATE(),
		updatedAt DATETIME,
		isArchived BIT DEFAULT 0
	);

	ALTER TABLE tbl_conversations
	ADD CONSTRAINT conversations_pk PRIMARY KEY(conversationID);

	ALTER TABLE tbl_conversations
	ADD CONSTRAINT conversations_userID_fk FOREIGN KEY(conversationID) REFERENCES tbl_users(userID);
	END;

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_messages')
	BEGIN
	CREATE TABLE tbl_messages(
		messageID INT IDENTITY (1,1),
		userID INT NOT NULL,
		conversationID INT NOT NULL,
		content NVARCHAR,
		createdAt DATETIME DEFAULT GETDATE(),
		updatedAt DATETIME,
		isBOT bit
	)

	ALTER TABLE tbl_messages
	ADD CONSTRAINT messages_pk PRIMARY KEY(messageID)

	ALTER TABLE tbl_messages
	ADD CONSTRAINT messages_userID FOREIGN KEY(userID) REFERENCES tbl_users(userID)

	ALTER TABLE tbl_messages
	ADD CONSTRAINT messages_conversationID FOREIGN KEY(conversationID) REFERENCES tbl_conversations(conversationID)
	END;

IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_sharedConversations')
	BEGIN
	CREATE TABLE tbl_sharedConversations(
		sharedConversationID INT IDENTITY (1,1),
		userID INT NOT NULL,
		conversationID INT NOT NULL,
		createdAt DATETIME DEFAULT GETDATE()
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
			content NVARCHAR(100) NOT NULL,
			createdAt DATETIME DEFAULT GETDATE(),
			updatedAt DATETIME,
			deletedAt DATETIME,
		);

		ALTER TABLE tbl_systemMessages
		ADD CONSTRAINT systemMessages_pk PRIMARY KEY(sysMsgID)
	END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_botConfigs')
	BEGIN
		CREATE TABLE tbl_botConfigs(
			userID INT NOT NULL,
			promptContent NVARCHAR(500) NOT NULL,
			createdAt DATETIME DEFAULT GETDATE(),
			updatedAt DATETIME
		);

		ALTER TABLE tbl_botConfigs
		ADD CONSTRAINT botConfigs_pk PRIMARY KEY(userID)
	END

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'tbl_documents')
	BEGIN
		CREATE TABLE tbl_documents(
			documentID INT NOT NULL,
			[label] NVARCHAR(500) NOT NULL,
			[path] VARCHAR(200) NOT NULL,
			createdAt DATETIME DEFAULT GETDATE(),
			updatedAt DATETIME
		);

		ALTER TABLE tbl_documents
		ADD CONSTRAINT documents_pk PRIMARY KEY(documentID)
	END