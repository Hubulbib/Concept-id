import jwt from 'jsonwebtoken';
import 'dotenv/config.js';
export const AuthMiddleware = (req, res, next) => {
    var _a;
    try {
        const JWT_SECRET = process.env.SECRET_ACCESS_JWT;
        if (!req.headers.authorization)
            return res.status(401).end();
        const accessToken = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization.split(' ')[1];
        if (!accessToken) {
            return res.status(401).end();
        }
        const userData = jwt.verify(accessToken, JWT_SECRET);
        if (!userData || typeof userData === 'string') {
            return res.status(400).end();
        }
        req['user'] = {
            ...userData._doc,
            details: {
                ua: req.get('User-Agent'),
                ip: req.ip,
            },
        };
        next();
    }
    catch (err) {
        return res.status(500).json(err);
    }
};
//# sourceMappingURL=auth.middleware.js.map