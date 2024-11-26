import { UserRole } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class SendUserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  surname: string;

  @Expose()
  username: string;

  @Expose()
  isActivated: boolean;

  @Expose()
  role: UserRole;

  @Exclude()
  ip: string;

  @Exclude()
  password: string;
}