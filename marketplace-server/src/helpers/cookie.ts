import { ConfigService } from "@nestjs/config";
import { Response } from "express";

export function setRefreshInCookie(res: Response, config: ConfigService, key: string, content: string) {
  res.cookie(key, content, {
    maxAge: config.get<number>('REFRESH_TOKEN_LIFE_CYCLE_HOURS') * 60 * 60 * 1000,
    httpOnly: true,
    signed: true,
    secure: false,
  });
}