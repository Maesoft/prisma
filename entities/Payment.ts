import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { Purchase } from "./Purchase";
import { CashManagement } from "./CashManagement";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fecha: Date;

    @Column({ unique: true })
    nro_comprobante: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;

    @OneToMany(() => Purchase, (purchase) => purchase.payment)
    facturas: Purchase[];

    @ManyToOne(() => Provider, (provider) => provider.payment)
    proveedor: Provider;

    @ManyToOne(() => CashManagement, (cash) => cash.payment)
    caja: CashManagement
}
