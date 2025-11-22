import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ExpensesCategory } from "./ExpensesCategory";

@Entity()
export class Expenses {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    numero_comprobante: string;

    @Column({ type: 'date' })
    fecha: Date;

    @ManyToOne(() => ExpensesCategory, (category) => category.expenses)
    categoria: ExpensesCategory;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'text', nullable: true })
    observaciones: string | null;
}