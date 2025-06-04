"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxSales = void 0;
const typeorm_1 = require("typeorm");
const Sale_1 = require("./Sale");
let TaxSales = class TaxSales {
};
exports.TaxSales = TaxSales;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaxSales.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaxSales.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TaxSales.prototype, "porcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TaxSales.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Sale_1.Sale, (sale) => sale.impuestos, { onDelete: "CASCADE" }),
    __metadata("design:type", Sale_1.Sale)
], TaxSales.prototype, "sale", void 0);
exports.TaxSales = TaxSales = __decorate([
    (0, typeorm_1.Entity)()
], TaxSales);
