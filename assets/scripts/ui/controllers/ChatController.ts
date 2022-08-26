import { IChatInfo } from "../../entity/IChatInfo";
import { ApiConstants } from "../../network/ApiConstants";
import { UserSession } from "../../network/auth/UserSession";
import { HttpRequestMaker } from "../../network/HttpRequestMaker";
import { ChatPanel } from "../panels/chat/ChatPanel";
import { ISessionController } from "./ISessionController";

export class ChatController implements ISessionController {
    private _userSession: UserSession;
    private _httpRequestMaker: HttpRequestMaker;

    private _chatPanel: ChatPanel;

    constructor(httpRequestMaker: HttpRequestMaker, chatPanel: ChatPanel) {
        this._httpRequestMaker = httpRequestMaker;
        this._chatPanel = chatPanel;

        this._setChatPanelVisible(false);
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }
    
    activate() {
        this._setChatPanelVisible(true);

        this._refreshChats();
    }

    deactivate() {
        this._setChatPanelVisible(false);
    }

    private _refreshChats() {
        let url = ApiConstants.buildRestAddr(this._userSession.baseServerUrl, ApiConstants.CHAT_ROUTE);
        let req = this._httpRequestMaker.createNewRequestWithAuth(url, ApiConstants.HTTP_GET, this._userSession, (error, message) => {
            if (error) {
                console.error(message);
                return;
            }
            
            let resp: IChatInfo[] = JSON.parse(message);
            this._chatPanel.refreshChats(resp);
        });

        req.send();
    }

    // ================== PANEL METHODS ==================

    private _setChatPanelVisible(isVisible: boolean) {
        this._chatPanel.node.active = isVisible;
    }
}