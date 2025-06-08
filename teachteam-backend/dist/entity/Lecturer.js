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
exports.Lecturer = void 0;
const typeorm_1 = require("typeorm");
const LecturerProfile_1 = require("./LecturerProfile");
let Lecturer = class Lecturer {
};
exports.Lecturer = Lecturer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int" }),
    __metadata("design:type", Number)
], Lecturer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 40 }),
    __metadata("design:type", String)
], Lecturer.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 256, unique: true }),
    __metadata("design:type", String)
], Lecturer.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Lecturer.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Lecturer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], Lecturer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => LecturerProfile_1.LecturerProfile, (profile) => profile.lecturer, { cascade: true, nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", LecturerProfile_1.LecturerProfile)
], Lecturer.prototype, "profile", void 0);
exports.Lecturer = Lecturer = __decorate([
    (0, typeorm_1.Entity)()
], Lecturer);
