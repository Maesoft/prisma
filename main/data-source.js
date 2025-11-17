"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Provider_1 = require("../entities/Provider");
const ProductCategory_1 = require("../entities/ProductCategory");
const Product_1 = require("../entities/Product");
const Stock_1 = require("../entities/Stock");
const Client_1 = require("../entities/Client");
const DetailsSale_1 = require("../entities/DetailsSale");
const Sale_1 = require("../entities/Sale");
const Options_1 = require("../entities/Options");
const Price_1 = require("../entities/Price");
const Tax_1 = require("../entities/Tax");
const DetailsPurchase_1 = require("../entities/DetailsPurchase");
const Purchase_1 = require("../entities/Purchase");
const Payment_1 = require("../entities/Payment");
const CashManagement_1 = require("../entities/CashManagement");
const Receipt_1 = require("../entities/Receipt");
const TaxSales_1 = require("../entities/TaxSales");
const TaxPurchases_1 = require("../entities/TaxPurchases");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./db/prisma_contable.sqlite",
    synchronize: true,
    logging: true,
    entities: [
        Provider_1.Provider,
        ProductCategory_1.ProductCategory,
        Product_1.Product,
        Stock_1.Stock,
        Client_1.Client,
        DetailsSale_1.DetailsSale,
        DetailsPurchase_1.DetailsPurchase,
        Sale_1.Sale,
        Purchase_1.Purchase,
        Options_1.Option,
        Price_1.Price,
        Tax_1.Tax,
        TaxSales_1.TaxSales,
        TaxPurchases_1.TaxPurchases,
        Payment_1.Payment,
        CashManagement_1.CashManagement,
        Receipt_1.Receipt,
    ]
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log("***Conexion a la base de datos establecida con exito***");
})
    .catch((err) => {
    console.log("Error al inicializar la conexion a la base de datos:" + err);
});
