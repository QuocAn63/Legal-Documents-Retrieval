import { Request } from 'express';

export interface RequestWithFileValidation extends Request {
  fileValidation?: string;
}

export interface RequestWithPublicRoute extends Request {
  isPublic: boolean;
}
