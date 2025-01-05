import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Details{
    @PrimaryGeneratedColumn()
    id:number
    
}