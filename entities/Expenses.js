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
exports.Expenses = void 0;
const typeorm_1 = require("typeorm");
const ExpensesCategory_1 = require("./ExpensesCategory");
let Expenses = class Expenses {
};
exports.Expenses = Expenses;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Expenses.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Expenses.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ExpensesCategory_1.ExpensesCategory, (category) => category.expenses),
    __metadata("design:type", ExpensesCategory_1.ExpensesCategory)
], Expenses.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Expenses.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Expenses.prototype, "observaciones", void 0);
exports.Expenses = Expenses = __decorate([
    (0, typeorm_1.Entity)()
], Expenses);
