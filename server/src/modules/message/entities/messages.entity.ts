import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ConversationEntity from '../../conversation/entities/conversations.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import * as moment from 'moment';

@Entity({
  name: 'messages',
})
export default class MessageEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
  })
  userID: string;

  @Column({
    type: 'varchar',
  })
  conversationID: string;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  replyToMessageID: string;

  @Column({
    type: 'nvarchar',
    length: 'max',
  })
  content: string;

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
    type: 'datetime',
    nullable: true,
    transformer: {
      from: (value) =>
        value ? moment(value).format('DD/MM/YYYY hh:mm:ss') : null,
      to: (value) => value,
    },
  })
  updatedAt: string;

  @DeleteDateColumn({
    type: 'datetime',
    nullable: true,
    transformer: {
      from: (value) =>
        value ? moment(value).format('DD/MM/YYYY hh:mm:ss') : null,
      to: (value) => value,
    },
  })
  deletedAt: string;

  @Column({
    type: 'bit',
  })
  isBOT: boolean;

  @OneToOne(() => MessageEntity)
  @JoinColumn({ name: 'replyToMessageID' })
  replyToMessage: MessageEntity;

  @ManyToOne((user) => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

  @ManyToOne((conversation) => ConversationEntity)
  @JoinColumn({ name: 'conversationID' })
  conversation: ConversationEntity;
}
