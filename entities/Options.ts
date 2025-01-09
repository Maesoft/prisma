import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Option {
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    nombre: string
    @Column()
    cuit: string
    @Column()
    domicilio: string
    @Column()
    telefono: string
    @Column()
    logo: string
    @Column()
    regimen: string
}