var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose';
import { tsUnix } from '../../utils/date.js';
import { genUuid } from '../../utils/generate.js';
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
export class SessionIds {
}
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], SessionIds.prototype, "uuidUser", void 0);
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], SessionIds.prototype, "uuidDevice", void 0);
class SessionRefreshToken {
}
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], SessionRefreshToken.prototype, "token", void 0);
__decorate([
    prop({ type: Number, required: true }),
    __metadata("design:type", Number)
], SessionRefreshToken.prototype, "expire", void 0);
class SessionAccessToken {
}
__decorate([
    prop({ type: String, required: true }),
    __metadata("design:type", String)
], SessionAccessToken.prototype, "token", void 0);
__decorate([
    prop({ type: Number, required: true }),
    __metadata("design:type", Number)
], SessionAccessToken.prototype, "expire", void 0);
let Session = class Session {
};
__decorate([
    prop({ type: String, required: true, default: () => genUuid() }),
    __metadata("design:type", String)
], Session.prototype, "uuid", void 0);
__decorate([
    prop({ type: () => SessionIds, default: {}, required: true, _id: false }),
    __metadata("design:type", SessionIds)
], Session.prototype, "ids", void 0);
__decorate([
    prop({ type: () => SessionRefreshToken, default: {}, required: true, _id: false }),
    __metadata("design:type", SessionRefreshToken)
], Session.prototype, "refreshToken", void 0);
__decorate([
    prop({ type: () => SessionAccessToken, default: {}, required: true, _id: false }),
    __metadata("design:type", SessionAccessToken)
], Session.prototype, "accessToken", void 0);
__decorate([
    prop({ type: () => BaseDates, default: {}, required: true, _id: false }),
    __metadata("design:type", BaseDates)
], Session.prototype, "dates", void 0);
Session = __decorate([
    modelOptions({
        schemaOptions: { collection: 'session' },
        options: {
            customName: 'session',
            allowMixed: Severity.ALLOW,
        },
    })
], Session);
export { Session };
export const sessionModel = getModelForClass(Session, {
    options: { allowMixed: Severity.ALLOW },
});
//# sourceMappingURL=token.entity.js.map