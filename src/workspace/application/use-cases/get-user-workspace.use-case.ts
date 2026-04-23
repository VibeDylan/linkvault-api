import { Inject, Injectable } from "@nestjs/common";
import { IWOrkspaceRepository } from "../ports/workspace.repository.port";
import { WORKSPACE_REPOSITORY } from "../ports/workspace.repository.port";

@Injectable()
export class GetUserWorkspaceUseCase {
    constructor(
        @Inject(WORKSPACE_REPOSITORY)
        private readonly workspaceRepository: IWOrkspaceRepository,
    ) {}

    async execute(userId: string) {
        return await this.workspaceRepository.listByUserId(userId);
    }
}