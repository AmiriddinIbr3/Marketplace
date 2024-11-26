import { IMessage } from "../message/IMessage";

export type IChatInfo = {
    currentContent: string,
    messages: IMessage[],
}