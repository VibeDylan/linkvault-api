import { WorkspaceEntity } from "../../domain/workspace.entity";

export interface IWOrkspaceRepository {
    create(workspace: WorkspaceEntity): Promise<WorkspaceEntity>;
    findById(id: string): Promise<WorkspaceEntity | null>;
    listByUserId(userId: string): Promise<WorkspaceEntity[]>;
    inviteMember(workspaceId: string, userId: string, role: 'ADMIN' | 'MEMBER'): Promise<void>;
}

export const WORKSPACE_REPOSITORY = Symbol('IWorkspaceRepository');