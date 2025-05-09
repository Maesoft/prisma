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
exports.Receipt = void 0;
const typeorm_1 = require("typeorm");
const Client_1 = require("./Client");
const Sale_1 = require("./Sale");
const CashManagement_1 = require("./CashManagement");
let Receipt = class Receipt {
};
exports.Receipt = Receipt;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Receipt.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Date)
], Receipt.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Receipt.prototype, "nro_comprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: false }),
    __metadata("design:type", Number)
], Receipt.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Sale_1.Sale, (sale) => sale.receipt),
    __metadata("design:type", Array)
], Receipt.prototype, "sale", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Client_1.Client, (client) => client.sales),
    __metadata("design:type", Client_1.Client)
], Receipt.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CashManagement_1.CashManagement, (cash) => cash.receipt),
    __metadata("design:type", Array)
], Receipt.prototype, "caja", void 0);
exports.Receipt = Receipt = __decorate([
    (0, typeorm_1.Entity)()
], Receipt);
