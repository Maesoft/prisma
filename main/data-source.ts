import { DataSource } from "typeorm";
import { Provider } from "../entities/Provider";
import { ProductCategory } from "../entities/ProductCategory";
import { Product } from "../entities/Product";
import { Stock } from "../entities/Stock";
import { Client } from "../entities/Client";
import { DetailsSale } from "../entities/DetailsSale";
import { Sale } from "../entities/Sale";
import { Option } from "../entities/Options";
import { Price } from "../entities/Price";
import { Tax } from "../entities/Tax";
import { DetailsPurchase } from "../entities/DetailsPurchase";
import { Purchase } from "../entities/Purchase";
import { Payment } from "../entities/Payment";
import { CashManagement } from "../entities/CashManagement";
import { Receipt } from "../entities/Receipt";
import { TaxSales } from "../entities/TaxSales";
import { TaxPurchases } from "../entities/TaxPurchases";
import { Expenses } from "../entities/Expenses";
import { ExpensesCategory } from "../entities/ExpensesCategory";


export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",
    synchronize: true,
    logging: true,
    entities: [
        Provider,
        ProductCategory,
        Product,
        Stock,
        Client,
        DetailsSale,
        DetailsPurchase,
        Sale,
        Purchase,
        Option,
        Price,
        Tax,
        TaxSales,
        TaxPurchases,
        Payment,
        CashManagement,
        Receipt,
        Expenses,
        ExpensesCategory, 
    ]
});

AppDataSource.initialize()
    .then(() => {
        console.log("***Conexion a la base de datos establecida con exito***");
    })
    .catch((err) => {
        console.log("Error al inicializar la conexion a la base de datos:" + err);
    });
