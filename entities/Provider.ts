import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Purchase } from './Purchase';
import { Payment } from './Payment';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    codigo: string;

    @Column({ unique: true, nullable: false })
    razon_social: string;

    @Column({ unique: true, nullable: false })
    cuit: string;

    @Column()
    direccion: string;

    @Column()
    telefono: string;

    @Column()
    email: string;

    @Column()
    regimen: 'Monotributista' | 'Responsable Inscripto';

    @OneToMany(() => Purchase, (purchase) => purchase.provider)
    purchase: Purchase[];

    @OneToMany(() => Payment, (payment) => payment.provider)
    payment: Payment[];
}
