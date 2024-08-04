import { hash } from 'bcrypt';
import { userModel } from '../../entities/user.entity.js';
import { UserMapper } from '../../mappers/user.mapper.js';
export class UserRepositoryImpl {
    constructor() {
        this.userRepository = userModel;
    }
    async getOneById(userId) {
        const user = await this.userRepository.findOne({ uuid: userId });
        if (!user) {
            throw Error('Такого пользователя не существует');
        }
        return UserMapper.toDomain(user);
    }
    async getAll() {
        return (await this.userRepository.find({}, null)).map((el) => UserMapper.toDomain({
            ...el['_doc'],
        }));
    }
    async editOne(userId, editBody) {
        const user = await this.userRepository.findOne({ uuid: userId });
        if (!user) {
            throw Error('Такого пользователя не существует');
        }
        let hashedPassword = editBody.password;
        if ('password' in editBody) {
            hashedPassword = await hash(editBody.password, 4);
        }
        await this.userRepository.findOneAndUpdate({ uuid: userId }, { ...editBody, password: hashedPassword }, { new: true });
    }
    async removeOne(userId) {
        const user = await this.userRepository.findOne({ uuid: userId });
        if (!user) {
            throw Error('Такого пользователя не существует');
        }
        await this.userRepository.deleteOne({ uuid: userId });
    }
}
//# sourceMappingURL=user.repository.impl.js.map