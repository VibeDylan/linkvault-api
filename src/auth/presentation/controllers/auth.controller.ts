import { Controller, Body, Post, Res } from "@nestjs/common";
import { LoginUseCase } from "src/auth/application/use-cases/login.use-case";
import { RegisterUseCase } from "src/auth/application/use-cases/register.use-case";
import { RegisterDto } from "../dto/register.dto";
import type { Response } from "express";
import { UseGuards, Get, Req } from "@nestjs/common";
import { JwtGuard } from "src/auth/infrastructure/guards/jwt.guard";
import type { Request } from "express";
import { LoginDto } from "../dto/login.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly registerUseCase: RegisterUseCase,
        private readonly loginUseCase: LoginUseCase
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

    @UseGuards(JwtGuard)
    @Get('me')
    me(@Req() req: Request) {
        return req.user;
    }
}