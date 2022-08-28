import { IChat } from "../../chat/Chat";
import { IChatInfo } from "../../entity/IChatInfo";
import { EventConstants } from "../../EventConstants";
import { UserSession } from "../../network/auth/UserSession";
import { ChatPanel } from "../panels/chat/ChatPanel";
import { ISessionController } from "./ISessionController";

export class ChatController implements ISessionController {
    private _userSession: UserSession; //TODO: use model
    private _chat: IChat;

    private _chatPanel: ChatPanel;

    constructor(chat: IChat, chatPanel: ChatPanel) {
        this._chat = chat;
        this._chatPanel = chatPanel;

        this._setChatPanelVisible(false);
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }
    
    activate() {
        this._setChatPanelVisible(true);
        this._refreshChats();

        this._chat.eventTarget.on(EventConstants.CHAT_START, this._onChatStarted, this);
        this._chatPanel.eventTarget.on(EventConstants.CHAT_SELECTED, this._onChatSelected, this);
    }

    deactivate() {
        this._chat.eventTarget.off(EventConstants.CHAT_START, this._onChatStarted, this);

        this._setChatPanelVisible(false);
    }

    private _refreshChats() {
        this._chat.fetchUserChats((result) => {
            if (result != null) {
                this._chatPanel.refreshChats(result);
            }
        });
    }

    // ================== MODEL CALLBACKS ==================

    private _onChatStarted(chat: IChatInfo) {
        this._chat.setActiveChat(chat);
        this._refreshChats();
    }

    // ================== UI CALLBACKS ==================

    private _onChatSelected(chat: IChatInfo) {
        console.log("Chat selected: ", chat.title); //TODO
        this._chat.setActiveChat(chat);
    }

    // ================== PANEL METHODS ==================

    private _setChatPanelVisible(isVisible: boolean) {
        this._chatPanel.node.active = isVisible;
    }
}