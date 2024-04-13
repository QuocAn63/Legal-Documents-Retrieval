import { ConfigEntity } from 'src/modules/config/entities/config.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'documents' })
export class DocumentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  label: string;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  configID: string;

  @Column({ type: 'smallint' })
  rank: number;

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

  @ManyToOne(() => ConfigEntity, (config) => config.id)
  @JoinColumn({ name: 'configID' })
  config: ConfigEntity;
}
