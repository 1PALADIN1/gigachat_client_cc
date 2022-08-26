import { IUserInfo } from "./IUserInfo";

export interface IMessageInfo {
    message: string,
    sendTime: string,
    fromUser: IUserInfo
}