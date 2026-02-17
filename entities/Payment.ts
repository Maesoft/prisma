import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { Purchase } from "./Purchase";
import { Expenses } from "./Expenses";
import { CashMovement } from "./CashMovement";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    fecha: Date;

    @Column({ unique: true })
    nro_comprobante: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @OneToMany(() => Purchase, (purchase) => purchase.payment)
    facturas: Purchase[];

    @ManyToOne(() => Provider, (provider) => provider.payment)
    proveedor: Provider;

    @Column({ type: 'text', nullable: true })
    observaciones: string;
}
