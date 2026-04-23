import { Controller, Body, Post, Res, Req, UnauthorizedException } from "@nestjs/common";
import { LoginUseCase } from "src/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "src/auth/application/use-cases/register.use-case";
import { RegisterDto } from "../dto/register.dto";
import type { Response } from "express";
import type { Request } from "express";
import { LoginDto } from "../dto/login.dto";
import { RefreshUseCase } from "src/auth/application/use-cases/refresh.use-case";


@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase,
        private readonly refreshUseCase: RefreshUseCase

    ) { }

    @Post('register')
    async register(@Body() data: RegisterDto, @Res() res: Response) {
        const { user, accessToken, refreshToken } = await this.registerUseCase.execute(data);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            }
        });
    }

    @Post('login')
    async login(@Body() data: LoginDto, @Res() res: Response) {
        const { user, accessToken, refreshToken } = await this.loginUseCase.execute(data);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            accessToken,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            }
        });
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {

        const token = req.cookies?.refreshToken;
        if (!token) throw new UnauthorizedException('No refresh token');

        const { accessToken, refreshToken } = await this.refreshUseCase.execute(token);

        // On set le nouveau cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ accessToken });
    }
}