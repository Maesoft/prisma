import { DataSource } from "typeorm";
import { Provider } from "../entities/Provider";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",  
    synchronize: true,  
    logging: true,
    entities: [Provider],  
});

AppDataSource.initialize()
    .then(() => {
        console.log("¡Conexión a la base de datos establecida con éxito!");
    })
    .catch((err) => {
        console.log("Error al inicializar la conexión a la base de datos:"+err);
    });
