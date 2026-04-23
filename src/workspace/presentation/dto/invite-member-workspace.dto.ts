import { IsEnum, IsString } from "class-validator";

export class InviteMemberWorkspaceDto {
    @IsString()
    userId: string;

    @IsEnum(['ADMIN', 'MEMBER'])
    role: 'ADMIN' | 'MEMBER';
}