import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CashBox } from "./CashBox";
import { CashMovement } from "./CashMovement";

@Entity()
export class CashSession {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CashBox)
  cashBox: CashBox;

  @Column({ type: 'datetime' })
  openedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  closedAt: Date;

  @Column('decimal', { precision: 15, scale: 2 })
  openingAmount: number;

  @Column('decimal', { precision: 15, scale: 2, nullable: true })
  closingAmount: number;

  @Column({ default: true })
  open: boolean;

  @OneToMany(() => CashMovement, m => m.cashSession)
  movements: CashMovement[];
}
