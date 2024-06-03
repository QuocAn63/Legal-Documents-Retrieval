export interface IDocument {
  id: string;
  label: string;
  content: string;
  rank: number;
  configID: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddDocument {
  label: string;
  content: string;
  rank: number;
  configID: string;
}

export interface IUpdateDocument {
  label: string;
  content: string;
  rank: number;
  documentID: string;
}

export interface 