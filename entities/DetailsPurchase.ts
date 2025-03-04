import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Purchase } from "./Purchase";

@Entity()
export class DetailsPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Purchase, (purchase) => purchase.details, { nullable: false, onDelete: "CASCADE" })
  purchase: Purchase;

  @Column()
  producto: string;

  @Column()
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
