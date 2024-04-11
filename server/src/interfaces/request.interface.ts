export interface RequestWithFileValidation extends Express.Request {
  fileValidation?: string;
}
