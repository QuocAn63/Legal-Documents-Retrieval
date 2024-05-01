import MessageEntity from 'src/modules/message/entities/messages.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ReportReasonEntity from './reportReason.entity';
import * as moment from 'moment';

@Entity({ name: 'reports' })
export default class ReportEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  userID: string;

  @Column({
    type: 'varchar',
  })
  messageID: string;

  @Column({
    type: 'varchar',
  })
  reasonID: string;

  @Column({
    type: 'nvarchar',
    length: 200,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'integer',
  })
  status: string;

  @CreateDateColumn({
    type: 'datetime',
    default: () => 'GETDATE()',
    nullable: true,
    transformer: {
      from: (value) =>
        value ? moment(value).format('DD/MM/YYYY hh:mm:ss') : null,
      to: (value) => value,
    },
  })
  createdAt: string;

  @UpdateDateColumn({
    nullable: true,
    transformer: {
      from: (value) =>
        value ? moment(value).format('DD/MM/YYYY hh:mm:ss') : null,
      to: (value) => value,
    },
  })
  updatedAt: string;

  @ManyToOne((user) => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

  @ManyToOne((message) => MessageEntity)
  @JoinColumn({ name: 'messageID' })
  message: MessageEntity;

  @ManyToOne((reason) => ReportReasonEntity)
  @JoinColumn({ name: 'reasonIDID' })
  reason: ReportReasonEntity;
}
