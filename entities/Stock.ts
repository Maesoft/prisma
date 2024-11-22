import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Stock {
    
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    fecha: Date;

    @ManyToOne(() => Product, (product) => product.stockMovements,{onDelete: "CASCADE"})
    producto: Product;

    @Column()
    detalle: string;

    @Column()
    operacion: 'Ingreso' | 'Egreso'; 

    @Column("int")
    cantidad: number;

    @Column("int")
    stockResultante: number; 

}
