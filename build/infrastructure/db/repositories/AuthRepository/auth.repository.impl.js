import { compare, hash } from 'bcrypt';
import { genUuid } from '../../../utils/generate.js';
import { UserMapper } from '../../mappers/user.mapper.js';
import { ApiError } from '../../../exceptions/api.exception.js';
import { userModel } from '../../entities/user.entity.js';
import { SessionRepositoryImpl } from '../TokenReposiory/session.repository.impl.js';
import 'dotenv/config.js';
export class AuthRepositoryImpl {
    constructor() {
        this.userRepository = userModel;
        this.sessionRepository = new SessionRepositoryImpl();
        this.signUp = async (signUpDto, detail) => {
            const candidate = await this.userRepository.findOne({ email: signUpDto.email });
            if (candidate) {
                throw ApiError.BadRequest('Пользователь с таким username уже существует');
            }
            const device = {
                ...detail,
                uuid: genUuid(),
            };
            const hashedPassword = await hash(signUpDto.password, 4);
            const user = await this.userRepository.create({
                ...signUpDto,
                uuid: genUuid(),
                password: hashedPassword,
                devices: [device],
            });
            return await this.responseData(user, device.uuid);
        };
        this.signIn = async (signInDto, detail) => {
            const user = await this.userRepository.findOne({ email: signInDto.email });
            if (!user) {
                throw ApiError.BadRequest('Пользователь с таким username не найден');
            }
            const comparePassword = await compare(signInDto.password, user.password);
            if (!comparePassword) {
                throw ApiError.BadRequest('Неверные данные при входе');
            }
            const device = user.devices.find((e) => e.ua === detail.ua && e.ip === detail.ip);
            console.log('device >', device);
            if (!device) {
                const uuidDevice = genUuid();
                await this.userRepository.updateOne({
                    uuid: user.uuid,
                }, {
                    $push: {
                        devices: {
                            ...detail,
                            uuid: uuidDevice,
                        },
                    },
                });
                return await this.responseData(user, uuidDevice);
            }
            console.log('user.uuid >', user.uuid);
            const session = await this.sessionRepository.findSessionByIds({ uuidDevice: device.uuid, uuidUser: user.uuid });
            console.log('session >', session);
            return {
                refreshToken: session.refreshToken.token,
                accessToken: session.accessToken.token,
                user: UserMapper.toDomain(user),
            };
        };
        this.logout = async (refreshToken) => {
            const session = await this.sessionRepository.findSessionByRefresh(refreshToken);
            if (!session) {
                throw new Error('logout.session.notFound');
            }
            const user = await this.userRepository.findOne({ uuid: session.ids.uuidUser });
            if (!user) {
                throw new Error('logout.user.notFound');
            }
            await this.userRepository.updateOne({
                uuid: user.uuid,
            }, {
                $set: { devices: user.devices.filter((e) => e.uuid !== session.ids.uuidDevice) },
            });
            await this.sessionRepository.removeSessionByRefresh(refreshToken);
        };
        this.refresh = async (refreshDto, detail) => {
            if (!refreshDto.refreshToken) {
                throw ApiError.UnauthorizedError();
            }
            const userData = this.sessionRepository.validateRefreshToken(refreshDto.refreshToken);
            const session = await this.sessionRepository.findSessionByRefresh(refreshDto.refreshToken);
            if (!userData || !session) {
                throw ApiError.UnauthorizedError();
            }
            const user = await this.userRepository.findOne({ uuid: session.ids.uuidUser });
            const device = user.devices.find((e) => e.ua === detail.ua && e.ip === detail.ip);
            await this.sessionRepository.removeSessionByRefresh(refreshDto.refreshToken);
            return await this.responseData(user, device.uuid);
        };
        this.responseData = async (userData, uuidDevice) => {
            const tokens = this.sessionRepository.generateTokens({ ...userData });
            await this.sessionRepository.saveToken({ uuidUser: userData.uuid, tokens, uuidDevice });
            return {
                ...tokens,
                user: UserMapper.toDomain(userData),
            };
        };
    }
}
//# sourceMappingURL=auth.repository.impl.js.map