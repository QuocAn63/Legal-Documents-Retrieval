import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ValidateMessages } from 'src/enum/validateMessages';

export class SaveReportDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.REPORT_MSGID_EMPTY })
  messageID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.REPORT_REASONID_EMPTY })
  reasonID: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;
}

export class FilterReportDTO {
  @ApiProperty({ required: false })
  userID: string;

  @ApiProperty({ required: false })
  reasonID: string;

  @ApiProperty({ required: false })
  description: string;

  @ApiProperty({ required: false })
  status: string;

  @ApiProperty({ required: false })
  fromDate: string;

  @ApiProperty({ required: false })
  toDate: string;
}

export class UpdateReportDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.REPORT_ID_EMPTY })
  reportID: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: ValidateMessages.REPORT_STATUS_EMPTY })
  status: string;
}

export class DeleteReportDTO {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty({ message: ValidateMessages.COMMON_ID_EMPTY })
  IDs: string[];
}
