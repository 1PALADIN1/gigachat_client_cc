import { IMessageInfo } from "../entity/IMessageInfo";

export class MessageHelper {
    static parseMessage(input: any, actualUserId: number): IMessageInfo {
        let userId: number = input["user"]["id"];
        let isUser: boolean = userId == actualUserId;

        let data: IMessageInfo = {
            message: input["text"],
            sendTime: input["send_time"],
            userId: userId,
            username: isUser ? "Me" : input["user"]["username"],
            isUser: isUser
        };

        return data;
    }
}