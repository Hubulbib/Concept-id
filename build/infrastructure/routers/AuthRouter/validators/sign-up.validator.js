import { body } from 'express-validator';
export const SignUpValidator = [
    body('username').exists({ values: 'falsy' }).notEmpty().isLength({ min: 3, max: 30 }),
    body('email').exists({ values: 'falsy' }).notEmpty().isEmail(),
    body('name').exists({ values: 'falsy' }).notEmpty(),
    body('surname').exists({ values: 'falsy' }).notEmpty(),
    body('gender').exists({ values: 'falsy' }).notEmpty().isIn(['male', 'female']),
    body('password')
        .isString()
        .isStrongPassword({ minLength: 6, minUppercase: 1, minLowercase: 1, minNumbers: 1, minSymbols: 1 }),
    body('phone').optional().exists({ values: 'falsy' }).isMobilePhone('ru-RU'),
    body('dateBirthday').optional().exists({ values: 'falsy' }).notEmpty().isDate(),
    body('avatar').optional().exists({ values: 'falsy' }).notEmpty().isURL(),
];
//# sourceMappingURL=sign-up.validator.js.map