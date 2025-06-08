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
exports.LecturerProfile = void 0;
const typeorm_1 = require("typeorm");
const Lecturer_1 = require("./Lecturer");
const Course_1 = require("./Course");
let LecturerProfile = class LecturerProfile {
};
exports.LecturerProfile = LecturerProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int" }),
    __metadata("design:type", Number)
], LecturerProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], LecturerProfile.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], LecturerProfile.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000 }),
    __metadata("design:type", String)
], LecturerProfile.prototype, "biography", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 1000 }),
    __metadata("design:type", String)
], LecturerProfile.prototype, "links", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], LecturerProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: "timestamp" }),
    __metadata("design:type", Date)
], LecturerProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Course_1.Course, (course) => course.lecturers),
    (0, typeorm_1.JoinTable)({
        name: "lecturer_courses", // Join table name
        joinColumn: { name: "lecturerProfileId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "courseCode", referencedColumnName: "code" },
    }),
    __metadata("design:type", Array)
], LecturerProfile.prototype, "courses", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => Lecturer_1.Lecturer, (lecturer) => lecturer.profile),
    __metadata("design:type", Lecturer_1.Lecturer)
], LecturerProfile.prototype, "lecturer", void 0);
exports.LecturerProfile = LecturerProfile = __decorate([
    (0, typeorm_1.Entity)()
], LecturerProfile);
