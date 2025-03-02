import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Provider } from "./Provider";
import { Details } from "./Details";

@Entity()
export class Purchase{
    @PrimaryGeneratedColumn()
     id: number;
   
     @Column({ type: 'date' })
     fecha: Date;
   
     @Column()
     tipo_comprobante: string;
   
     @Column()
     numero_comprobante: string;
   
     @ManyToOne(() => Provider, (provider) => provider.purchase)
     provider: Provider;
   
     @Column({ type: 'decimal', precision: 15, scale: 2 })
     total: number;
     
     @Column()
     observacion: string;
   //pensar como guardar los detalles de las ventas y las compras
    //  @OneToMany(() => Details, (details) => details.sale, { cascade: true })
    //  details: Details[];
   }
   