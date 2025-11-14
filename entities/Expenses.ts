import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CashManagement } from "./CashManagement";

@Entity()
export class Expenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    fecha: Date;

    @OneToMany(() => CategoryExpenses, (categoryExpenses) => categoryExpenses.expenses)
    categoryExpenses: CategoryExpenses[];

    @OneToMany(() => CashManagement, (cash) => cash.expenses)
    caja: CashManagement[];

}