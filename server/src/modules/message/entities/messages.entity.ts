import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import ConversationEntity from '../../conversation/entities/conversations.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

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
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
  })
  updatedAt: string;

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
