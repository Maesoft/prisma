import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { Sale } from "./Sale";
import { CashManagement } from "./CashManagement";

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "date", nullable: false })
    fecha: Date;

    @Column({ unique: true, nullable: false })
    nro_comprobante: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    monto: number;

    @OneToMany(() => Sale, (sale) => sale.receipt)
    facturas: Sale[];

    @ManyToOne(() => Client, (client) => client.sales)
    cliente: Client;

    @ManyToOne(() => CashManagement, (cash) => cash.receipt)
    caja: CashManagement[];
}
