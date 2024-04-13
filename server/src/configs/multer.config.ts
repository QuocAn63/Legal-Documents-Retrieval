import { extname } from 'path';
import { RequestWithFileValidation } from 'src/interfaces/request.interface';
import { v4 } from 'uuid';

export const editedFilename = (
  req: Express.Request,
  file: Express.Multer.File,
  callback,
) => {
  const fileExtName = extname(file.originalname);
  const fileName = v4().toUpperCase();

  callback(null, `${fileName}${fileExtName}`);
};

export const pdfFileFilter = (
  req: RequestWithFileValidation,
  file: Express.Multer.File,
  callback,
) => {
  const fileExtName = extname(file.originalname);
  const fileSize = file.size;

  if (fileExtName !== '.pdf') {
    callback(null, false);
    req.fileValidation = 'Chỉ chấp nhận tài liệu có định dạng PDF';
    return;
  }

  if (fileSize > 3000000) {
    callback(null, false);
    req.fileValidation = 'Chỉ chấp nhận tài liệu có kích thước nhỏ hơn 3mb';
    return;
  }
  callback(null, true);
};
