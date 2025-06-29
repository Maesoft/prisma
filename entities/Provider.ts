import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne } from 'typeorm';
import { Purchase } from './Purchase';
import { Payment } from './Payment';
import { Product } from './Product';

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

    @OneToMany(() => Product, (product) => product.proveedor)
    productos: Product[];

    @OneToMany(() => Purchase, (purchase) => purchase.provider)
    purchase: Purchase[];

    @OneToMany(() => Payment, (payment) => payment.proveedor)
    payment: Payment[];
}
