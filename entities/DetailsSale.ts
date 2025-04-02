import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./Sale";

@Entity()
export class DetailsSale {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Sale, (sale) => sale.details, { nullable: false, onDelete:"CASCADE" })
  sale: Sale;

  @Column()
  producto: string;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
