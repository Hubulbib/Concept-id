import { UserService } from '../../../core/services/UserService/user.service.js';
import { UserRepositoryImpl } from '../../db/repositories/UserRepository/user.repository.impl.js';
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.getAll = async (req, res, next) => {
            try {
                const userData = await this.userService.getAll();
                res.json(userData);
            }
            catch (err) {
                next(err);
            }
        };
        this.getOneById = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userData = await this.userService.getOneById(id);
                res.json(userData);
            }
            catch (err) {
                next(err);
            }
        };
        this.editOne = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userBody = req.body;
                await this.userService.editOne(id, userBody);
                res.end();
            }
            catch (err) {
                next(err);
            }
        };
        this.removeOne = async (req, res, next) => {
            try {
                const { id } = req.params;
                await this.userService.removeOne(id);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
export default new UserController(new UserService(new UserRepositoryImpl()));
//# sourceMappingURL=user.controller.js.map