import { UserEntity } from '../../../core/entites/user.entity.js';
export class UserMapper {
    static toDomain(entity) {
        return new UserEntity(entity.uuid, entity.username, entity.email, entity.name, entity.surname, entity.gender, entity.role, entity.phone, entity.dateBirthday, entity.avatar);
    }
}
//# sourceMappingURL=user.mapper.js.map