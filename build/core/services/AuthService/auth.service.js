export class AuthService {
    constructor(authRepository) {
        this.authRepository = authRepository;
        this.signIn = async (signInDto, detail) => {
            return await this.authRepository.signIn(signInDto, detail);
        };
        this.signUp = async (signUpDto, detail) => {
            return await this.authRepository.signUp(signUpDto, detail);
        };
        this.refresh = async (refreshDto, detail) => {
            return await this.authRepository.refresh(refreshDto, detail);
        };
        this.logout = async (refreshToken) => {
            await this.authRepository.logout(refreshToken);
        };
    }
}
//# sourceMappingURL=auth.service.js.map