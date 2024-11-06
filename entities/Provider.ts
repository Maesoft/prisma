import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    razon_social: string;

    @Column({unique:true})
    cuit: number;

    @Column()
    direccion: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    regimen: 'Monotributista' | 'Responsable Inscripto';
}
