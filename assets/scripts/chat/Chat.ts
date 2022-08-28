import { IChatInfo } from "../entity/IChatInfo";
import { ISessionEntity } from "../entity/ISessionEntity";
import { ApiConstants } from "../network/ApiConstants";
import { UserSession } from "../network/auth/UserSession";
import { HttpRequestMaker } from "../network/HttpRequestMaker";
import { EventTarget } from "cc";
import { EventConstants } from "../EventConstants";

export interface IChat extends ISessionEntity {
    eventTarget: EventTarget;

    get hasActiveChat(): boolean;
    get activeChat(): IChatInfo;

    startChatWithUser(userId: number, username: string);
    setActiveChat(chat: IChatInfo);
    fetchUserChats(callback: (result: IChatInfo[]) => void);
}

export class Chat implements IChat {
    private _httpRequestMaker: HttpRequestMaker;
    private _userSession: UserSession;
    private _activeChat: IChatInfo;
    
    eventTarget: EventTarget = new EventTarget();

    constructor(httpRequestMaker: HttpRequestMaker) {
        this._httpRequestMaker = httpRequestMaker;
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }

    get hasActiveChat(): boolean {
        return this._activeChat != null;
    }

    get activeChat(): IChatInfo {
        return this._activeChat;
    }

    startChatWithUser(userId: number, username: string) {
        let chatName = this._userSession.username + " " + username;
        let url = ApiConstants.buildRestAddr(this._userSession.baseServerUrl, ApiConstants.CHAT_ROUTE);
        let req = this._httpRequestMaker.createNewRequestWithAuth(url, ApiConstants.HTTP_POST, this._userSession, (error, message) => {
            if (error) {
                console.error(message);
                return;
            }

            let chatInfo: IChatInfo = {
                id: JSON.parse(message)["id"],
                title: chatName,
                description: ""
            }

            this.eventTarget.emit(EventConstants.CHAT_START, chatInfo);
        });

        let data = {
            title: this._userSession.username + " " + username,
            user_ids: [
                this._userSession.userId,
                userId
            ]
        }

        req.send(JSON.stringify(data));
    }

    setActiveChat(chat: IChatInfo) {
        this._activeChat = chat;
        let url = ApiConstants.buildChatMessagesRoute(this._userSession.baseServerUrl, chat.id);
        let req = this._httpRequestMaker.createNewRequestWithAuth(url, ApiConstants.HTTP_GET, this._userSession, (error, message) => {
            if (error) {
                console.error(message);
                return;
            }

            let resp = JSON.parse(message);
            for (let i = 0; i < resp.length; i++) {
                //TODO: load messages
            }
            
            this.eventTarget.emit(EventConstants.CHAT_SET_ACTIVE)
        });

        req.send();
    }

    fetchUserChats(callback: (result: IChatInfo[]) => void) {
        let url = ApiConstants.buildRestAddr(this._userSession.baseServerUrl, ApiConstants.CHAT_ROUTE);
        let req = this._httpRequestMaker.createNewRequestWithAuth(url, ApiConstants.HTTP_GET, this._userSession, (error, message) => {
            if (error) {
                console.error(message);
                return;
            }
            
            let resp: IChatInfo[] = JSON.parse(message);
            callback(resp);
        });

        req.send();
    }
}