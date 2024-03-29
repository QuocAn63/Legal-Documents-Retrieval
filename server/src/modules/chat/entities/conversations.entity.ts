import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'conversations',
})
export default class ConversationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 25 })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar', length: 50 })
  email: string;

  @Column({ type: 'varchar' })
  googleID: string;

  @CreateDateColumn({
    type: 'datetime',
    default: 'GETDATE()',
    nullable: true,
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'datetime',
    default: 'GETDATE()',
    nullable: true,
  })
  updatedAt: string;

  @DeleteDateColumn({
    type: 'datetime',
    default: 'GETDATE()',
    nullable: true,
  })
  deletedAt: string;

  @Column({ type: 'bit', default: '0' })
  isBOT: string;

  @Column({ type: 'bit', default: '0' })
  isADMIN: string;
}
