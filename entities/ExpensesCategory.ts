import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Expenses } from "./Expenses";

@Entity()
export class ExpensesCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Expenses, (expense) => expense.categoria)
    expenses: Expenses[]
}