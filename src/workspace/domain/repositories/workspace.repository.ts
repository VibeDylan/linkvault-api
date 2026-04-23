import { WorkspaceEntity } from "../../domain/workspace.entity";
import { IWOrkspaceRepository } from "../../application/ports/workspace.repository.port";
import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class WorkspaceRepository implements IWOrkspaceRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: { name: string }): Promise<WorkspaceEntity> {
        const workspace = await this.prisma.workspace.create({ data });
        return new WorkspaceEntity(workspace.id, workspace.name, workspace.createdAt, workspace.updatedAt)
    }

    async findById(id: string): Promise<WorkspaceEntity | null> {
        const workspace = await this.prisma.workspace.findUnique({ where: { id } });
        return workspace ? new WorkspaceEntity(workspace.id, workspace.name, workspace.createdAt, workspace.updatedAt) : null;
    }
    async listByUserId(userId: string): Promise<WorkspaceEntity[]> {
        const workspaces = await this.prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        });
        return workspaces.map(ws => new WorkspaceEntity(ws.id, ws.name, ws.createdAt, ws.updatedAt));
    }
    async inviteMember(workspaceId: string, userId: string, role: 'ADMIN' | 'MEMBER'): Promise<void> {
        await this.prisma.workspaceMember.create({
            data: {
                workspaceId,
                userId,
                role
            }
        });
    }

    async findMember(workspaceId: string, userId: string): Promise<{ role: 'ADMIN' | 'MEMBER' } | null> {
        const member = await this.prisma.workspaceMember.findFirst({
            where: {
                workspaceId,
                userId,
            },
        });
        return member ? { role: member.role } : null;
    }
}