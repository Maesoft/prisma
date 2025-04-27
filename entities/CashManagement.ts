import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Payment } from "./Payment";

@Entity()
export class CashManagement {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    codigo:string
    
    @CreateDateColumn()
    fecha_apertura: Date;

    @Column()
    fecha_cierre: Date;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    saldo: number;

    @Column()
    activa: boolean;

    @OneToMany(() => Payment, (pay) => pay.cashManagement)
    pay: Payment[];

    //Aqui iran los cobros


}