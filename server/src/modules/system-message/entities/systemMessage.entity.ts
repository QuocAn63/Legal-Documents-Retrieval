import {
  BaseEntity,
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'systemMessages' })
export default class SystemMessageEntity extends BaseEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column({
    type: 'nvarchar',
  })
  content: string;
}
