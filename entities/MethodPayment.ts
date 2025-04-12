import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "./Payment";

@Entity()
export class MethodPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    metodo_pago: string;

    @OneToMany(() => Payment, (payment) => payment.methodPayment)
    payment: Payment[];
}