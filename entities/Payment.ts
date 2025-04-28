import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethodUsed } from "./PaymentMethodUsed";
import { Provider } from "./Provider";
import { Purchase } from "./Purchase";

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
    purchase: Purchase[];

    @ManyToOne(() => Provider, (provider) => provider.payment)
    provider: Provider;

    @OneToMany(() => PaymentMethodUsed, (pmu) => pmu.payment)
    paymentMethodsUsed: PaymentMethodUsed[];
}
