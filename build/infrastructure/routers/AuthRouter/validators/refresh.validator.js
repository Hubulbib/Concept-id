import { cookie } from 'express-validator';
export const RefreshValidator = [cookie('refreshToken').exists().notEmpty().isJWT()];
//# sourceMappingURL=refresh.validator.js.map