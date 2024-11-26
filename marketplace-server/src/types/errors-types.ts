import { BadRequestException } from "@nestjs/common";

export interface Result<T> {
    error: T | null;
    success: boolean;
}

export type possibleMailErrors =
    BadRequestException |
    Error |
    null

export const MAX_INT = 2147483647;