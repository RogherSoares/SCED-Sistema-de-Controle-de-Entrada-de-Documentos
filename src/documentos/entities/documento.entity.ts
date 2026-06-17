import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HistoricoEntity } from '../../historico/entities/historico.entity';
import { StatusDocumentoEntity } from '../../status-documentos/entities/status-documento.entity';
import { TiposDocumentoEntity } from '../../tipos-documentos/entities/tipos-documento.entity';

@Entity('documentos')
export class DocumentoEntity {
  @PrimaryGeneratedColumn({ name: 'id_documento' })
  idDocumento: number;

  @Column({ name: 'protocolo', type: 'varchar', length: 40, unique: true })
  protocolo: string;

  @Column({ name: 'remetente', type: 'varchar', length: 180 })
  remetente: string;

  @Column({ name: 'descricao', type: 'text', nullable: true })
  descricao?: string;

  @Column({ name: 'arquivo_url', type: 'varchar', length: 255, nullable: true })
  arquivoUrl?: string;

  @Column({ name: 'data_entrada', type: 'timestamp' })
  dataEntrada: Date;

  @ManyToOne(() => TiposDocumentoEntity, (tipo) => tipo.documentos, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_tipo' })
  tipo: TiposDocumentoEntity;

  @ManyToOne(() => StatusDocumentoEntity, (status) => status.documentos, {
    nullable: false,
  })
  @JoinColumn({ name: 'id_status' })
  status: StatusDocumentoEntity;

  @OneToMany(() => HistoricoEntity, (historico) => historico.documento)
  historicos: HistoricoEntity[];
}
