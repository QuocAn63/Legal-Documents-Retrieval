export interface IConfig {
  id: string;

  userID: string;

  description: string;

  promptContent: string;

  splitted: boolean;

  chunkSize: number;

  chunkOverlap: number;

  k: number;

  createdAt: string;

  updatedAt: string;

  documents: [];
}

export interface IUpdateConfig {
  configID: string;
  userID: string;
  promptContent: string;
  description: string;
  k: number;
  chunkSize: number;
  chunkOverlap: number;
  splitted: boolean;
}
