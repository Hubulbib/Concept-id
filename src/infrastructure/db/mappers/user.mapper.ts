import { type User } from '../entities/user.entity.js'
import { UserEntity } from '../../../core/entites/user.entity.js'

export class UserMapper {
  public static toDomain(entity: User): UserEntity {
    return new UserEntity(
      entity.uuid,
      entity.username,
      entity.email,
      entity.role,
      entity.name,
      entity.surname,
      entity.gender,
      entity.phone,
      entity.dateBirthday,
      entity.avatar,
    )
  }
}
