import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentoEntity } from '../../documentos/entities/documento.entity';

@Entity('tipos_documento')
export class TiposDocumentoEntity {
  @PrimaryGeneratedColumn({ name: 'id_tipo' })
  idTipo: number;

  @Column({ name: 'nome_tipo', type: 'varchar', length: 120, unique: true })
  nomeTipo: string;

  @Column({ name: 'descricao', type: 'varchar', length: 255, nullable: true })
  descricao?: string;

  @OneToMany(() => DocumentoEntity, (documento) => documento.tipo)
  documentos: DocumentoEntity[];
}
