import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsuarioEntity } from '../../usuarios/entities/usuario.entity';

@Entity('two_factor_codes')
export class TwoFactorCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'codigo_hash', type: 'varchar', length: 255 })
  codigoHash: string;

  @Column({ name: 'expira_em', type: 'timestamp' })
  expiraEm: Date;

  @Column({ name: 'utilizado', type: 'boolean', default: false })
  utilizado: boolean;

  @Column({ name: 'tentativas', type: 'int', default: 0 })
  tentativas: number;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @ManyToOne(() => UsuarioEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: UsuarioEntity;
}