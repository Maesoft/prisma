import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { DetailsPurchase } from "./DetailsPurchase";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  tipo_comprobante: string;

  @Column()
  numero_comprobante: string;

  @ManyToOne(() => Provider, (provider) => provider.purchase)
  provider: Provider;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column()
  observacion: string;

  @OneToMany(() => DetailsPurchase, (details) => details.purchase, { cascade: true })
  details: DetailsPurchase[];
}
