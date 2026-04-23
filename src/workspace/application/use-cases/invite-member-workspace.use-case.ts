import { Inject, Injectable } from "@nestjs/common";
import { IWOrkspaceRepository, WORKSPACE_REPOSITORY } from "../ports/workspace.repository.port";

@Injectable()
export class InviteMemberWorkspaceUseCase {
    constructor(
        @Inject(WORKSPACE_REPOSITORY)
        private readonly workspaceRepository: IWOrkspaceRepository,
    ) {}

    async execute(workspaceId: string, userId: string, role: 'ADMIN' | 'MEMBER') {
        await this.workspaceRepository.inviteMember(workspaceId, userId, role);
    }
}