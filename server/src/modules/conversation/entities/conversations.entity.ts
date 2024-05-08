import * as moment from 'moment';
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

  @Column({ type: 'bit', default: '0' })
  isArchived: boolean;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;
}
