"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Provider_1 = require("../entities/Provider");
const Category_1 = require("../entities/Category");
const Product_1 = require("../entities/Product");
const Stock_1 = require("../entities/Stock");
const Client_1 = require("../entities/Client");
const DetailsSale_1 = require("../entities/DetailsSale");
const Sale_1 = require("../entities/Sale");
const Options_1 = require("../entities/Options");
const DetailsPurchase_1 = require("../entities/DetailsPurchase");
const Purchase_1 = require("../entities/Purchase");
const Payment_1 = require("../entities/Payment");
const MethodPayment_1 = require("../entities/MethodPayment");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",
    synchronize: true,
    logging: true,
    entities: [Provider_1.Provider, Category_1.Category, Product_1.Product, Stock_1.Stock, Client_1.Client, DetailsSale_1.DetailsSale, DetailsPurchase_1.DetailsPurchase, Sale_1.Sale, Purchase_1.Purchase, Options_1.Option, Payment_1.Payment, MethodPayment_1.MethodPayment],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("***Conexion a la base de datos establecida con exito***");
})
    .catch((err) => {
    console.log("Error al inicializar la conexion a la base de datos:" + err);
});
