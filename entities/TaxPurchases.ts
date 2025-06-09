import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./Sale";
import { Purchase } from "./Purchase";

@Entity()
export class TaxPurchases {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    porcentaje: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    monto: number;

    @ManyToOne(() => Purchase, (purchase) => purchase.impuestos, { onDelete: "CASCADE" })
    purchase: Purchase;
}