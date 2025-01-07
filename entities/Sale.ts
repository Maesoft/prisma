import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { Details } from "./Details";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fecha: Date;

  @Column()
  tipo_comprobante: string;

  @Column()
  numero_comprobante: string;

  @ManyToOne(() => Client, (client) => client.sales)
  client: Client;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;
  
  @Column()
  observacion: string;

  @OneToMany(() => Details, (details) => details.sale, { cascade: true })
  details: Details[];
}
