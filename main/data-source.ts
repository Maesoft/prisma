import { DataSource } from "typeorm";
import { Provider } from "../entities/Provider";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Stock } from "../entities/Stock";
import { Client } from "../entities/Client";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",  
    synchronize: true,  
    logging: true,
    entities: [Provider, Category, Product, Stock, Client],  
});

AppDataSource.initialize()
    .then(() => {
        console.log("¡Conexión a la base de datos establecida con éxito!");
    })
    .catch((err) => {
        console.log("Error al inicializar la conexión a la base de datos:"+err);
    });
