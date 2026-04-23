import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { IWOrkspaceRepository, WORKSPACE_REPOSITORY } from "../ports/workspace.repository.port";

@Injectable()
export class InviteMemberWorkspaceUseCase {
    constructor(
        @Inject(WORKSPACE_REPOSITORY)
        private readonly workspaceRepository: IWOrkspaceRepository,
    ) {}

    async execute(workspaceId: string, userId: string, role: 'ADMIN' | 'MEMBER') {
        const workspace = await this.workspaceRepository.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundException('Workspace not found');
        }

        const member = await this.workspaceRepository.findMember(workspaceId, userId);
        if (member) {
            throw new ConflictException('User is already a member of this workspace');
        }

        await this.workspaceRepository.inviteMember(workspaceId, userId, role);
    }
}