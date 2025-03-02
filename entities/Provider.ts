import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Purchase } from './Purchase';

@Entity()
export class Provider {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true, nullable:false})
    codigo: string;
   
    @Column({unique:true, nullable:false})
    razon_social: string;

    @Column({unique:true, nullable:false})
    cuit: number;

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
}
