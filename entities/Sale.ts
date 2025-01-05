import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Client } from "./Client";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id:number

  @CreateDateColumn()
  fecha: Date;

  @Column()
  tipo_comprobante:string

  @Column()
  numero_comprobante:string

  @ManyToOne(()=> Client, (client) => client.sales)
  client:Client;

  @Column()
  total: number

  @OneToMany(()=> )