import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Installments {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cuotas: number

    @Column({ default: "mensuales" })
    frecuencia: string

    @Column()
    porcentaje: number
}