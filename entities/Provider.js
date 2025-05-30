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
exports.Provider = void 0;
const typeorm_1 = require("typeorm");
const Purchase_1 = require("./Purchase");
const Payment_1 = require("./Payment");
let Provider = class Provider {
};
exports.Provider = Provider;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Provider.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Provider.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Provider.prototype, "razon_social", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Provider.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Provider.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Provider.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Provider.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Provider.prototype, "regimen", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Purchase_1.Purchase, (purchase) => purchase.provider),
    __metadata("design:type", Array)
], Provider.prototype, "purchase", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Payment_1.Payment, (payment) => payment.proveedor),
    __metadata("design:type", Array)
], Provider.prototype, "payment", void 0);
exports.Provider = Provider = __decorate([
    (0, typeorm_1.Entity)()
], Provider);
