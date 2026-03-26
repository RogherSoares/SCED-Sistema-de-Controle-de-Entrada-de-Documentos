import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DocumentoEntity } from '../../documentos/entities/documento.entity';
import { StatusDocumentoEntity } from '../../status-documentos/entities/status-documento.entity';
import { UsuarioEntity } from '../../usuarios/entities/usuario.entity';

@Entity('historicos')
export class HistoricoEntity {
  @PrimaryGeneratedColumn({ name: 'id_historico' })
  idHistorico: number;

  @ManyToOne(() => DocumentoEntity, (documento) => documento.historicos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_documento' })
  documento: DocumentoEntity;

  @ManyToOne(() => StatusDocumentoEntity, (status) => status.historicos, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_status' })
  status: StatusDocumentoEntity;

  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.historicos, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_usuario' })
  usuario: UsuarioEntity;

  @Column({
    name: 'data_movimentacao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataMovimentacao: Date;

  @Column({ name: 'observacao', type: 'varchar', length: 255, nullable: true })
  observacao?: string;
}
