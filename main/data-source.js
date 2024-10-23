"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Provider_1 = require("../entities/Provider");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",
    synchronize: true,
    logging: true,
    entities: [Provider_1.Provider],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("¡Conexión a la base de datos establecida con éxito!");
})
    .catch((err) => {
    console.log("Error al inicializar la conexión a la base de datos:" + err);
});
