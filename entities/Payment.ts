import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { Purchase } from "./Purchase";
import { CashManagement } from "./CashManagement";
import { Expenses } from "./Expenses";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ unique: true })
    nro_comprobante: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;

    @OneToMany(() => Purchase, (purchase) => purchase.payment, { onDelete: 'SET NULL', nullable: true })
    facturas: Purchase[];

    @OneToOne(() => Expenses, (expense) => expense.payment)
    gasto: Expenses;

    @ManyToOne(() => Provider, (provider) => provider.payment, { onDelete: 'CASCADE', nullable: true })
    proveedor: Provider;

    @ManyToOne(() => CashManagement, (cash) => cash.payment)
    caja: CashManagement

    @Column({ type: 'text', nullable: true })
    observaciones: string;
}
