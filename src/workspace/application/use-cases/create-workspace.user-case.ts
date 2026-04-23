import { Inject, Injectable } from "@nestjs/common";
import { IWOrkspaceRepository, WORKSPACE_REPOSITORY } from "../ports/workspace.repository.port";

@Injectable()
export class CreateWorkspaceUseCase {
    constructor(
        @Inject(WORKSPACE_REPOSITORY)
        private readonly workspaceRepository: IWOrkspaceRepository,
    ) {}

    async execute(data: { name: string, userId: string }) {
        const workspace = await this.workspaceRepository.create(data);
        await this.workspaceRepository.inviteMember(workspace.id, data.userId, 'ADMIN');
        return workspace;
    }
}