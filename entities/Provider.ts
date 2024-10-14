import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    razon_social: string;

    @Column()
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
