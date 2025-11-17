import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ExpensesCategory } from "./ExpensesCategory";

@Entity()
export class Expenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date' })
    fecha: Date;

    @OneToMany(() => ExpensesCategory, (category) => category.expenses)
    categoria: ExpensesCategory[];
}