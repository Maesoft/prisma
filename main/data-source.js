"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Provider_1 = require("../entities/Provider");
const Category_1 = require("../entities/Category");
const Product_1 = require("../entities/Product");
const Stock_1 = require("../entities/Stock");
const Client_1 = require("../entities/Client");
const Details_1 = require("../entities/Details");
const Sale_1 = require("../entities/Sale");
const Options_1 = require("../entities/Options");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",
    synchronize: true,
    logging: true,
    entities: [Provider_1.Provider, Category_1.Category, Product_1.Product, Stock_1.Stock, Client_1.Client, Details_1.Details, Sale_1.Sale, Options_1.Option],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("***Conexion a la base de datos establecida con exito***");
})
    .catch((err) => {
    console.log("Error al inicializar la conexion a la base de datos:" + err);
});
