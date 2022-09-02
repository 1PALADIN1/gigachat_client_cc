import { IMessageInfo } from "../entity/IMessageInfo";

export class MessageHelper {
    static parseMessage(input: any, actualUserId: number): IMessageInfo {
        let userId: number = input["user_id"];
        let isUser: boolean = userId == actualUserId;
        let utcTime: Date = new Date(input["send_time"] + " UTC");

        let data: IMessageInfo = {
            message: input["text"],
            sendTime: utcTime.toLocaleString(),
            userId: userId,
            username: isUser ? "Me" : input["username"],
            isUser: isUser
        };

        return data;
    }
}