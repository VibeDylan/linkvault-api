import { CreateWorkspaceUseCase } from "src/workspace/application/use-cases/create-workspace.user-case";
import { GetUserWorkspaceUseCase } from "src/workspace/application/use-cases/get-user-workspace.use-case";
import { Controller, Body, Post, Req, Get, UseGuards, UnauthorizedException, Param } from "@nestjs/common";
import { CreateWorkspaceDto } from "../dto/create-workspace.dto";
import { Request } from "express";
import { JwtGuard } from "src/auth/infrastructure/guards/jwt.guard";
import { InviteMemberWorkspaceUseCase } from "src/workspace/application/use-cases/invite-member-workspace.use-case";
import { InviteMemberWorkspaceDto } from "../dto/invite-member-workspace.dto";

@Controller('workspaces')
export class WorkspaceController {
    constructor(
        private readonly createWorkspaceUseCase: CreateWorkspaceUseCase,
        private readonly getUserWorkspaceUseCase: GetUserWorkspaceUseCase,
        private readonly inviteMemberWorkspaceUseCase: InviteMemberWorkspaceUseCase
    ) { }

    @UseGuards(JwtGuard)
    @Post()
    async create(@Body() data: CreateWorkspaceDto, @Req() req: Request) {
        const userId = req.user?.['id'];
        if (!userId) {
            throw new UnauthorizedException('User ID not found in request');
        }
        return await this.createWorkspaceUseCase.execute({ ...data, userId });
    }

    @UseGuards(JwtGuard)
    @Get()
    async list(@Req() req: Request) {
        const userId = req.user?.['id'];
        if (!userId) {
            throw new UnauthorizedException('User ID not found in request');
        }
        return await this.getUserWorkspaceUseCase.execute(userId);
    }

    @Post(':workspaceId/members')
    @UseGuards(JwtGuard)
    async addMember(@Req() req: Request, @Body() body: InviteMemberWorkspaceDto, @Param('workspaceId') workspaceId: string) {
        const userId = req.user?.['id'];

        if (!userId) {
            throw new UnauthorizedException('User ID not found in request');
        }

        return await this.inviteMemberWorkspaceUseCase.execute(workspaceId, body.userId, body.role);
    }
}