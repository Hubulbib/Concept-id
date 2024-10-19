import { PropType, Severity, getModelForClass, modelOptions, prop } from '@typegoose/typegoose'
import { EUserRole } from './enums/user-role.enum.js'
import { genUuid } from '../../utils/generate.js'
import { tsUnix } from '../../utils/date.js'

class BaseDates {
  @prop({ type: Number, default: () => tsUnix() })
  created: number

  @prop({ type: Number, default: () => tsUnix() })
  updated: number
}

class UserDevice {
  @prop({ type: String, required: true })
  uuid: string

  @prop({ type: String, required: true })
  ua: string

  @prop({ type: String, required: true })
  ip: string
}
@modelOptions({
  schemaOptions: { collection: 'user' },
  options: {
    customName: 'user',
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ type: String, required: true, default: () => genUuid() })
  uuid: string

  @prop({ type: String, required: true, unique: true })
  username: string

  @prop({ type: String, required: true, unique: true })
  email: string

  @prop({ type: String, required: true })
  password: string

  @prop({ type: String, required: true, unique: true })
  activationLink: string

  @prop({ enum: EUserRole, type: String, default: () => EUserRole.unverified })
  role: EUserRole

  @prop({ type: String, required: false })
  avatar?: string

  @prop({ type: () => UserDevice, default: [] }, PropType.ARRAY)
  devices: UserDevice[]

  @prop({ type: () => BaseDates, default: {}, required: true, _id: false })
  dates: BaseDates
}

export const userModel = getModelForClass(User, {
  options: { allowMixed: Severity.ALLOW },
})
