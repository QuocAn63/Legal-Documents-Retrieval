import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'reportReasons' })
export default class ReportReasonEntity extends BaseEntity {
  @PrimaryGeneratedColumn('identity')
  id: string;

  @Column({
    type: 'nvarchar',
    length: 200,
  })
  description: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
  })
  updatedAt: string;
}
