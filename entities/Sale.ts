import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { DetailsSale } from "./DetailsSale";
import { Receipt } from "./Receipt";
import { TaxSales } from "./TaxSales";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  tipo_comprobante: string;

  @Column()
  numero_comprobante: string;

  @ManyToOne(() => Client, (client) => client.sales, { onDelete: "CASCADE" })
  client: Client;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column()
  observacion: string;

  @OneToMany(() => DetailsSale, (details) => details.sale)
  details: DetailsSale[];

  @ManyToOne(() => Receipt, (rec) => rec.facturas)
  receipt: Receipt;

  @OneToMany(() => TaxSales, (taxSale) => taxSale.sale)
  impuestos: TaxSales[];
}
