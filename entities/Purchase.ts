import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { DetailsPurchase } from "./DetailsPurchase";
import { Payment } from "./Payment";
import { TaxPurchases } from "./TaxPurchases";

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  tipo_comprobante: string;

  @Column()
  numero_comprobante: string;

  @ManyToOne(() => Provider, (provider) => provider.purchase,{onDelete:"CASCADE"})
  provider: Provider;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  total: number;

  @Column()
  observacion: string;

  @OneToMany(() => DetailsPurchase, (details) => details.purchase)
  details: DetailsPurchase[];

  @ManyToOne(()=> Payment, (payment) => payment.facturas, {onDelete:'SET NULL', nullable:true})
  payment:Payment;

  @OneToMany(() => TaxPurchases, (taxPurchase) => taxPurchase.purchase)
  impuestos: TaxPurchases[];
}
