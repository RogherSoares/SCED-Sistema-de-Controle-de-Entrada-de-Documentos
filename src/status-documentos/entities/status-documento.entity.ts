import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentoEntity } from '../../documentos/entities/documento.entity';
import { HistoricoEntity } from '../../historico/entities/historico.entity';

@Entity('status_documento')
export class StatusDocumentoEntity {
  @PrimaryGeneratedColumn({ name: 'id_status' })
  idStatus: number;

  @Column({ name: 'nome_status', type: 'varchar', length: 100, unique: true })
  nomeStatus: string;

  @OneToMany(() => DocumentoEntity, (documento) => documento.status)
  documentos: DocumentoEntity[];

  @OneToMany(() => HistoricoEntity, (historico) => historico.status)
  historicos: HistoricoEntity[];
}
