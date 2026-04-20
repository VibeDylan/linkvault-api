import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseUser { 
    @ApiPropertyOptional({ description: 'The id of the user' })
    id: string;

    @ApiPropertyOptional({ description: 'The username of the user' })
    username?: string;

    @ApiProperty({description: 'The email of the user' })
    email: string;

    @ApiProperty({ description: 'The password of the user' })
    password: string;

    @ApiPropertyOptional({ description: 'The confirm password of the user' })
    confirmPassword?: string;
}