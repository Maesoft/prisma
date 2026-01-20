import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Installments {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cuotas: number

    @Column()
    porcentaje: number
}