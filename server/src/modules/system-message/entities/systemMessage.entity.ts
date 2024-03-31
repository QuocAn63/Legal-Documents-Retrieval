import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'systemMessages' })
export default class SystemMessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: string;

  @Column({
    type: 'nvarchar',
  })
  content: string;
}
