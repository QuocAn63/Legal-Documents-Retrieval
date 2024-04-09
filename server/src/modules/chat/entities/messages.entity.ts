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
import ConversationEntity from './conversations.entity';
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
    type: 'nvarchar',
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
  isBOT: string;

  @ManyToOne((user) => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

  @ManyToOne((conversation) => ConversationEntity)
  @JoinColumn({ name: 'conversationID' })
  conversation: ConversationEntity;
}