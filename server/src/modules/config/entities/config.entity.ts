import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { DocumentEntity } from 'src/modules/document/entities/document.entity';
import * as moment from 'moment';

@Entity({ name: 'configs' })
export class ConfigEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', nullable: true })
  description: string;

  @Column({ type: 'nvarchar', length: 'MAX' })
  promptContent: string;

  @Column({ type: 'varchar' })
  userID: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userID' })
  user: UserEntity;

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

  @ManyToMany(() => DocumentEntity, (document) => document.id)
  @JoinColumn()
  documents: DocumentEntity[];
}
