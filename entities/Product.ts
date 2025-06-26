import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "./Category"
import { Stock } from "./Stock";
import { Price } from "./Price";
import { Tax } from "./Tax";
import { Provider } from "./Provider";

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

    @OneToOne(()=> Provider, (provider)=> provider.producto)
    @JoinColumn()
    proveedor: Provider

    @OneToMany(()=> Price, (price)=> price.producto)
    precios: Price[];

    @OneToMany(()=> Tax, (tax)=> tax.producto)
    impuestos: Tax[];
    
    @OneToMany(() => Stock, (stock) => stock.producto)
    stockMovements: Stock[]; 
}