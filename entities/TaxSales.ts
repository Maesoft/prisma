import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sale } from "./Sale";

@Entity()
export class TaxSales {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    porcentaje: number;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    monto: number;

    @ManyToOne(() => Sale, (sale) => sale.impuestos, { onDelete: "CASCADE" })
    sale: Sale;
}