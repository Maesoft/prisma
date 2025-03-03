import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category"
import { Stock } from "./Stock";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column({unique:true, nullable:false})
    codigo: string

    @Column({unique:true, nullable:false})
    nombre: string

    @Column()
    descripcion: string

    @ManyToOne(() => Category, (category) => category.products)
    categoria: Category;

    @Column()
    imagen: string

    @Column()
    controla_stock:boolean

    @Column({default: 0})
    stock: number

    @Column({default: 0})
    costo: number

    @Column({default: 0})
    precio1: number

    @Column({default: 0})
    precio2: number

    @Column()
    iva:number

    @OneToMany(() => Stock, (stock) => stock.producto)
    stockMovements: Stock[]; 
}