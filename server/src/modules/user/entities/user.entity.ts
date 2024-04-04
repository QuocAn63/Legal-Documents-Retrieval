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
    nullable: true,
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  googleID: string;

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

  @DeleteDateColumn({
    type: 'datetime',
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

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resetPwdToken: string;
}
