import { ConfigEntity } from 'src/modules/config/entities/config.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'documents' })
export class DocumentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Column({ type: 'varchar' })
  path: string;

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

  @ManyToMany((config) => ConfigEntity, (config) => config.id)
  @JoinColumn()
  configs: ConfigEntity[];
}
