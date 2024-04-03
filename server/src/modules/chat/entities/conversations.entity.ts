import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'conversations',
})
export default class ConversationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  userID: string;

  @Column({ type: 'nvarchar' })
  title: string;

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

  @Column({ type: 'bit', default: '0' })
  isArchived: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;
}
