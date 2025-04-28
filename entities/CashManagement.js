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
exports.CashManagement = void 0;
const typeorm_1 = require("typeorm");
const PaymentMethodUsed_1 = require("./PaymentMethodUsed");
const ReceiptMethodUsed_1 = require("./ReceiptMethodUsed");
let CashManagement = class CashManagement {
};
exports.CashManagement = CashManagement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CashManagement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CashManagement.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CashManagement.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CashManagement.prototype, "fecha_apertura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Date)
], CashManagement.prototype, "fecha_cierre", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CashManagement.prototype, "saldo_inicial", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CashManagement.prototype, "saldo_final", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CashManagement.prototype, "activa", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PaymentMethodUsed_1.PaymentMethodUsed, (pmu) => pmu.cashManagement),
    __metadata("design:type", Array)
], CashManagement.prototype, "paymentMethodsUsed", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ReceiptMethodUsed_1.ReceiptMethodUsed, (rmu) => rmu.cashManagement),
    __metadata("design:type", Array)
], CashManagement.prototype, "receiptMethodsUsed", void 0);
exports.CashManagement = CashManagement = __decorate([
    (0, typeorm_1.Entity)()
], CashManagement);
