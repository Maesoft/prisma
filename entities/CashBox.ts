import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CashBox {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string; 

  @Column({ unique: true })
  name: string;

  @Column({ default: false })
  active: boolean;
}
