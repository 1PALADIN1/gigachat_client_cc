import { IChat } from "../../chat/Chat";
import { IChatInfo } from "../../entity/IChatInfo";
import { EventConstants } from "../../EventConstants";
import { MessageCommand } from "../../network/ws/MessageCommand";
import { IWsManager } from "../../network/ws/WsManager";
import { ChatPanel } from "../panels/chat/ChatPanel";
import { IUiController } from "./IUiController";

export class ChatController implements IUiController {
    private _chat: IChat;
    private _wsManager: IWsManager;

    private _chatPanel: ChatPanel;

    constructor(chat: IChat, wsManager: IWsManager, chatPanel: ChatPanel) {
        this._chat = chat;
        this._wsManager = wsManager;
        this._chatPanel = chatPanel;

        this._setChatPanelVisible(false);
    }
    
    activate() {
        this._setChatPanelVisible(true);
        this._refreshChats();

        this._chat.eventTarget.on(EventConstants.CHAT_START, this._onChatStarted, this);
        this._chatPanel.eventTarget.on(EventConstants.CHAT_SELECTED, this._onChatSelected, this);
        this._wsManager.eventTarget.on(EventConstants.WS_GOT_MESSAGE, this._onGotMessage, this);
    }

    deactivate() {
        this._chat.eventTarget.off(EventConstants.CHAT_START, this._onChatStarted, this);
        this._chatPanel.eventTarget.off(EventConstants.CHAT_SELECTED, this._onChatSelected, this);
        this._wsManager.eventTarget.off(EventConstants.WS_GOT_MESSAGE, this._onGotMessage, this);

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

    private _onGotMessage(message: string) {
        let resp = JSON.parse(message);
        if (resp["cmd"] != MessageCommand.MESSAGE) {
            return;
        }

        let payload = resp["payload"];
        let chatId: number = payload["chat_id"];
        if (!this._chat.hasChatInList(chatId)) {
            this._refreshChats();
        }
    }

    // ================== UI CALLBACKS ==================

    private _onChatSelected(chat: IChatInfo) {
        this._chat.setActiveChat(chat);
    }

    // ================== PANEL METHODS ==================

    private _setChatPanelVisible(isVisible: boolean) {
        this._chatPanel.node.active = isVisible;
    }
}