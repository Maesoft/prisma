import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sale } from './Sale';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    codigo: string;

    @Column({ unique: true, nullable: false })
    razon_social: string;

    @Column({ unique: true, nullable: false })
    cuit: number;

    @Column()
    direccion: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    regimen: 'Monotributista' | 'Responsable Inscripto' | 'Consumidor Final';

    @OneToMany(() => Sale, (sale) => sale.client)
    sales: Sale[];
}
