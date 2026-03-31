import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export enum Role {
    User = 'User',
    Unauthenticated = 'Unauthenticated',
    Admin = 'Admin',
}

export class JWTPayload {
    userId: string
    username: string
    roles: Role[]
}

export type AuthUser = JWTPayload;

export const CurrentUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AuthUser => {
        const req = ctx.switchToHttp().getRequest();
        return req.user;
    }
)