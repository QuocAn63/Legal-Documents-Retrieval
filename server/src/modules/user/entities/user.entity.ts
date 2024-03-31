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
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 25,
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
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

  @Column({
    type: 'bit',
  })
  isBOT: number;

  @Column({
    type: 'bit',
  })
  isADMIN: number;
}
