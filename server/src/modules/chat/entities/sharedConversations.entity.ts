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
import ConversationEntity from './conversations.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Entity({ name: 'sharedConversations' })
export default class SharedConversationEntity extends BaseEntity {
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
    generated: 'uuid',
    type: 'varchar',
  })
  sharedCode: string;

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

  @ManyToOne((user) => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

  @OneToOne((conversation) => ConversationEntity)
  @JoinColumn({ name: 'conversationID' })
  conversation: ConversationEntity;
}
