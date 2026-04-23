import { Module } from "@nestjs/common";
import { WorkspaceController } from "./presentation/controllers/workspace.controller";
import { CreateWorkspaceUseCase } from "./application/use-cases/create-workspace.user-case";
import { GetUserWorkspaceUseCase } from "./application/use-cases/get-user-workspace.use-case";
import { InviteMemberWorkspaceUseCase } from "./application/use-cases/invite-member-workspace.use-case";
import { AuthModule } from "src/auth/auth.module";
import { WORKSPACE_REPOSITORY } from "./application/ports/workspace.repository.port";
import { WorkspaceRepository } from "./domain/repositories/workspace.repository";

@Module({
    imports: [AuthModule],
    controllers: [WorkspaceController],
    providers: [
        CreateWorkspaceUseCase,
        GetUserWorkspaceUseCase,
        InviteMemberWorkspaceUseCase,
        {
            provide: WORKSPACE_REPOSITORY,
            useClass: WorkspaceRepository,
        }
    ],
    exports: [],
})
export class WorkspaceModule {}