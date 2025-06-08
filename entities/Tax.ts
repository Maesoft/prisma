import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Tax{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    titulo:string

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    porcentaje:number

    @ManyToOne(()=>Product,(product)=>product.impuestos, {onDelete: "CASCADE"})
    producto:Product
}