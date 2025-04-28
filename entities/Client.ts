import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sale } from './Sale';
import { Receipt } from './Receipt';

@Entity()
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, nullable: false })
    codigo: string;

    @Column({ unique: true, nullable: false })
    razon_social: string;

    @Column({ unique: true, nullable: true })
    cuit: string;

    @Column({nullable:true})
    direccion: string;

    @Column({nullable:true})
    telefono: string;

    @Column({nullable:true})
    email: string;

    @Column()
    regimen: 'Monotributista' | 'Responsable Inscripto' | 'Consumidor Final';

    @OneToMany(() => Sale, (sale) => sale.client)
    sales: Sale[];

    @OneToMany(() => Receipt, (rec) => rec.client)
    receipt: Receipt[];
}
