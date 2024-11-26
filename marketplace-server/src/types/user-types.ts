import { Token, User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      refreshToken?: Token;
      accessToken?: string;
    }
  }
}

export interface TokenWithUser extends Token {
  user?: User | null;
}