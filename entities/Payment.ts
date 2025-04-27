import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { Purchase } from "./Purchase";
import { CashManagement } from "./CashManagement";

@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    fecha: Date;

    @Column({ unique: true, nullable: false })
    nro_comprobante: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 , nullable: false})
    monto: number;

    @OneToMany(() => Purchase, (purchase) => purchase.op)
    purchase: Purchase;

    @ManyToOne(() => Provider, (provider) => provider.payment)
    provider: Provider;

    @ManyToOne(()=> CashManagement, (cash)=> cash.pay)
    cashManagement:CashManagement;

}
