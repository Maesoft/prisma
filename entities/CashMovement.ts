import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CashSession } from "./CashSession";

@Entity()
export class CashMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CashSession, session => session.movements)
  @JoinColumn()
  cashSession: CashSession;

  @Column()
  type: 'COBRO' | 'PAGO';

  @Column({ type: 'date' })
  date: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ unique: true })
  voucherNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: false })
  annulled: boolean;
}
