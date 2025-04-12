import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MethodPayment } from "./MethodPayment";
import { Provider } from "./Provider";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fecha: Date;

    @Column({ unique: true, nullable: false })
    nro_comprobante: string;

    @Column({ nullable: false })
    monto: number;

    @ManyToOne(() => MethodPayment, (methodPayment) => methodPayment.payment)
    methodPayment: MethodPayment;

    @ManyToOne(() => Provider, (provider) => provider.payment)
    provider: Provider;
}   