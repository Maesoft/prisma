import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "./Payment";
import { Receipt } from "./Receipt";

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

    @OneToMany(() => Payment, (pay) => pay.caja)
    payment: Payment[];

    @OneToMany(() => Receipt, (rec) => rec.caja)
    receipt: Receipt[];
}
