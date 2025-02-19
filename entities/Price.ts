import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class Price{
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    titulo:string

    @Column()
    precio:number
    
    @ManyToOne(()=>Product,(product)=>product.precios,{onDelete: "CASCADE"})
    producto:Product
}