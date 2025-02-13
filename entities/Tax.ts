import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Tax{
    @PrimaryGeneratedColumn()
    id:number
    
    @Column()
    titulo:string

    @Column()
    porcentaje:number

    @ManyToOne(()=>Product,(product)=>product.impuestos)
    producto:Product
}