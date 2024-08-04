import { getModelForClass, modelOptions, prop, Severity } from '@typegoose/typegoose'
import { tsUnix } from '../../utils/date.js'
import { genUuid } from '../../utils/generate.js'

class BaseDates {
  @prop({ type: Number, default: () => tsUnix() })
  created: number

  @prop({ type: Number, default: () => tsUnix() })
  updated: number
}
export class SessionIds {
  @prop({ type: String, required: true })
  uuidUser: string

  @prop({ type: String, required: true })
  uuidDevice: string
}

class SessionRefreshToken {
  @prop({ type: String, required: true })
  token: string

  @prop({ type: Number, required: true })
  expire: number
}

class SessionAccessToken {
  @prop({ type: String, required: true })
  token: string

  @prop({ type: Number, required: true })
  expire: number
}
@modelOptions({
  schemaOptions: { collection: 'session' },
  options: {
    customName: 'session',
    allowMixed: Severity.ALLOW,
  },
})
export class Session {
  @prop({ type: String, required: true, default: () => genUuid() })
  uuid: string

  @prop({ type: () => SessionIds, default: {}, required: true, _id: false })
  ids: SessionIds

  @prop({ type: () => SessionRefreshToken, default: {}, required: true, _id: false })
  refreshToken: SessionRefreshToken

  @prop({ type: () => SessionAccessToken, default: {}, required: true, _id: false })
  accessToken: SessionAccessToken

  @prop({ type: () => BaseDates, default: {}, required: true, _id: false })
  dates: BaseDates
}

export const sessionModel = getModelForClass(Session, {
  options: { allowMixed: Severity.ALLOW },
})
