import { IEmoji } from "../emoji/IEmoji";
import { IUser } from "../user/IUser";

export interface IMessage {
    content: String,
    author: IUser,
    emojis: IEmoji[],
    updated: boolean,
    createdAt: Date,
}