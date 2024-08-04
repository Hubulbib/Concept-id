var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PropType, Severity, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { EUserGender } from './enums/user-gender.enum.js';
import { EUserRole } from './enums/user-role.enum.js';
import { genUuid } from '../../utils/generate.js';
import { tsUnix } from '../../utils/date.js';
class BaseDates {
}
__decorate([
    prop({ type: Number, default: () => tsUnix() }),
    __metadata("design:type", Number)
], BaseDates.prototype, "created", void 0);
__decorate([
    prop({ type: Number, default: () => tsUnix() }),
    __metadata("design:type", Number)
], BaseDates.prototype, "updated", void 0);
class UserDevice {
}
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "uuid", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "ua", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], UserDevice.prototype, "ip", void 0);
let User = class User {
};
__decorate([
    prop({ type: String, required: true, default: () => genUuid() }),
    __metadata("design:type", String)
], User.prototype, "uuid", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "surname", void 0);
__decorate([
    prop({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    prop({ type: String, required: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    prop({ type: Date, required: false }),
    __metadata("design:type", Date)
], User.prototype, "dateBirthday", void 0);
__decorate([
    prop({ enum: EUserGender, required: true, default: () => EUserGender.male }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    prop({ enum: EUserRole, type: String, default: () => EUserRole.user }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    prop({ type: String, required: false }),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    prop({ type: () => UserDevice, default: [] }, PropType.ARRAY),
    __metadata("design:type", Array)
], User.prototype, "devices", void 0);
__decorate([
    prop({ type: () => BaseDates, default: {}, required: true, _id: false }),
    __metadata("design:type", BaseDates)
], User.prototype, "dates", void 0);
User = __decorate([
    modelOptions({
        schemaOptions: { collection: 'user' },
        options: {
            customName: 'user',
            allowMixed: Severity.ALLOW,
        },
    })
], User);
export { User };
export const userModel = getModelForClass(User, {
    options: { allowMixed: Severity.ALLOW },
});
//# sourceMappingURL=user.entity.js.map