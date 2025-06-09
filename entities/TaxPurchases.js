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
exports.TaxPurchases = void 0;
const typeorm_1 = require("typeorm");
const Purchase_1 = require("./Purchase");
let TaxPurchases = class TaxPurchases {
};
exports.TaxPurchases = TaxPurchases;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaxPurchases.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaxPurchases.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TaxPurchases.prototype, "porcentaje", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], TaxPurchases.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Purchase_1.Purchase, (purchase) => purchase.impuestos, { onDelete: "CASCADE" }),
    __metadata("design:type", Purchase_1.Purchase)
], TaxPurchases.prototype, "purchase", void 0);
exports.TaxPurchases = TaxPurchases = __decorate([
    (0, typeorm_1.Entity)()
], TaxPurchases);
