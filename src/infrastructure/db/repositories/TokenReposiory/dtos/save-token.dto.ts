import { type GenerateTokensResult } from './generate-tokens-result.dto.js'

export class SaveTokenDto {
  constructor(
    readonly uuidUser: string,
    readonly uuidDevice: string,
    readonly tokens: GenerateTokensResult,
  ) {}
}
