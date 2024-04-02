import { IsArray } from 'class-validator';

export class DeleteUserDTO {
  @IsArray()
  IDs: string[];
}
