import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HistoricoEntity } from '../../historico/entities/historico.entity';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn({ name: 'id_usuario' })
  idUsuario: number;

  @Column({ name: 'nome', type: 'varchar', length: 150 })
  nome: string;

  @Column({ name: 'email', type: 'varchar', length: 180, unique: true })
  email: string;

  @Column({ name: 'senha', type: 'varchar', length: 255 })
  senha: string;

  @Column({ name: 'perfil', type: 'varchar', length: 30, default: 'operador' })
  perfil: string;

  @OneToMany(() => HistoricoEntity, (historico) => historico.usuario)
  historicos: HistoricoEntity[];
}
