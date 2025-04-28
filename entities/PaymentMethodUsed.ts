import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { CashManagement } from "./CashManagement";
import { Payment } from "./Payment";

@Entity()
export class PaymentMethodUsed {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Payment, (payment) => payment.paymentMethodsUsed, { onDelete: 'CASCADE' })
    payment: Payment;

    @ManyToOne(() => CashManagement, { eager: true })
    cashManagement: CashManagement;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;
}
