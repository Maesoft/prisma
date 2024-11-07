import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category"
import { Stock } from "./Stock";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nombre: string

    @Column()
    descripcion: string

    @ManyToOne(() => Category, (category) => category.products)
    category: Category;

    @Column()
    imagen: string

    @Column()
    stock: number

    @Column()
    costo: number

    @Column()
    precio1: number

    @Column()
    precio2: number

    @OneToMany(() => Stock, (stock) => stock.producto)
    stockMovements: Stock[]; 
}