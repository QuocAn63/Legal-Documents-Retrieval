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

@Entity({ name: 'configs' })
export class ConfigEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar' })
  description: string;

  @Column({ type: 'nvarchar' })
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
  })
  createdAt: string;

  @UpdateDateColumn({
    type: 'datetime',
    nullable: true,
  })
  updatedAt: string;

  @ManyToMany(() => DocumentEntity, (document) => document.id)
  @JoinColumn()
  documents: DocumentEntity[];
}
