import { DataSource } from "typeorm";
import { Provider } from "../entities/Provider";
import { Category } from "../entities/Category";
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

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",
    synchronize: true,
    logging: true,
    entities: [Provider, Category, Product, Stock, Client, DetailsSale, DetailsPurchase, Sale, Purchase, Option, Price, Tax],
});

AppDataSource.initialize()
    .then(() => {
        console.log("***Conexion a la base de datos establecida con exito***");
    })
    .catch((err) => {
        console.log("Error al inicializar la conexion a la base de datos:" + err);
    });
