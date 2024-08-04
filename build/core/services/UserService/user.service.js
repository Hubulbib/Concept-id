export class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.getAll = async () => {
            return await this.userRepository.getAll();
        };
        this.getOneById = async (userId) => {
            return await this.userRepository.getOneById(userId);
        };
        this.editOne = async (userId, editBody) => {
            await this.userRepository.editOne(userId, editBody);
        };
        this.removeOne = async (userId) => {
            await this.userRepository.removeOne(userId);
        };
    }
}
//# sourceMappingURL=user.service.js.map