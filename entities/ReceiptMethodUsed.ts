import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Receipt } from "./Receipt";
import { CashManagement } from "./CashManagement";

@Entity()
export class ReceiptMethodUsed {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Receipt, (receipt) => receipt.receiptMethodsUsed, { onDelete: 'CASCADE' })
    receipt: Receipt;

    @ManyToOne(() => CashManagement, { eager: true })
    cashManagement: CashManagement;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    monto: number;
}
