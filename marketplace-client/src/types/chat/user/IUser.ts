import { EnumUserRoleInChannel } from "../role/EnumUserRoleInChannel";
import { EnumUserRoleInGroup } from "../role/EnumUserRoleInGroup";
import { EnumUserRoleInPrivate } from "../role/EnumUserRoleInPrivate";

export interface IUser {
    name: string,
    surname: string,
    avatar: Blob,
    role: EnumUserRoleInChannel |
          EnumUserRoleInGroup |
          EnumUserRoleInPrivate,
}