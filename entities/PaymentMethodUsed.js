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
exports.PaymentMethodUsed = void 0;
const typeorm_1 = require("typeorm");
const CashManagement_1 = require("./CashManagement");
const Payment_1 = require("./Payment");
let PaymentMethodUsed = class PaymentMethodUsed {
};
exports.PaymentMethodUsed = PaymentMethodUsed;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentMethodUsed.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Payment_1.Payment, (payment) => payment.paymentMethodsUsed, { onDelete: 'CASCADE' }),
    __metadata("design:type", Payment_1.Payment)
], PaymentMethodUsed.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CashManagement_1.CashManagement, { eager: true }),
    __metadata("design:type", CashManagement_1.CashManagement)
], PaymentMethodUsed.prototype, "cashManagement", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PaymentMethodUsed.prototype, "monto", void 0);
exports.PaymentMethodUsed = PaymentMethodUsed = __decorate([
    (0, typeorm_1.Entity)()
], PaymentMethodUsed);
