import * as moment from 'moment';
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
    select: false,
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

  @Column({
    type: 'bit',
  })
  isADMIN: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  resetPwdToken: string;
}
