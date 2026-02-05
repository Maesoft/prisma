import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { CashBoxSession } from "./CashBoxSession";
import { CashMovementType } from "./CashMovementType";

@Entity()
export class CashMovement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CashBoxSession, session => session.movements)
  @JoinColumn()
  cashSession: CashBoxSession;

  @Column({
    type: 'enum',
    enum: CashMovementType
  })
  type: CashMovementType;

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
