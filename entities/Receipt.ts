import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";
import { Sale } from "./Sale";
import { ReceiptMethodUsed } from "./ReceiptMethodUsed";

@Entity()
export class Receipt {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fecha: Date;

    @Column({ unique: true, nullable: false })
    nro_comprobante: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    monto: number;

    @OneToMany(() => Sale, (sale) => sale.receipt)
    sale: Sale[];

    @ManyToOne(() => Client, (client) => client.sales)
    client: Client;

    @OneToMany(() => ReceiptMethodUsed, (rmu) => rmu.receipt)
    receiptMethodsUsed: ReceiptMethodUsed[];
}
