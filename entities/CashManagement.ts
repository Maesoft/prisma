import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PaymentMethodUsed } from "./PaymentMethodUsed";
import { ReceiptMethodUsed } from "./ReceiptMethodUsed";

@Entity()
export class CashManagement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    codigo: string;

    @Column({ unique: true })
    nombre: string;

    @Column({ type: 'datetime', nullable: true })
    fecha_apertura: Date;

    @Column({ type: 'datetime', nullable: true })
    fecha_cierre: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    saldo_inicial: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    saldo_final: number;

    @Column({default: false})
    activa: boolean;

    @OneToMany(() => PaymentMethodUsed, (pmu) => pmu.cashManagement)
    paymentMethodsUsed: PaymentMethodUsed[];

    @OneToMany(() => ReceiptMethodUsed, (rmu) => rmu.cashManagement)
    receiptMethodsUsed: ReceiptMethodUsed[];
}
