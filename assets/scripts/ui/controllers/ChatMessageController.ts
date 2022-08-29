import { UserSession } from "../../network/auth/UserSession";
import { ChatMessagePanel } from "../panels/chat/ChatMessagePanel";
import { ISessionController } from "./ISessionController";
import { Node } from "cc"; 
import { IChat } from "../../chat/Chat";
import { EventConstants } from "../../EventConstants";
import { IMessageInfo } from "../../entity/IMessageInfo";
import { IWsManager } from "../../network/ws/WsManager";
import { UiConstants } from "../UiConstants";
import { MessageCommand } from "../../network/ws/MessageCommand";
import { MessageHelper } from "../../helper/MessageHelper";

enum PanelType {
    NONE,
    NOT_SELECTED,
    CHAT_SELECTED
}

export class ChatMessageController implements ISessionController {
    private _userSession: UserSession;
    
    private _chat: IChat;
    private _wsManager: IWsManager;

    private _chatMessagePanel: ChatMessagePanel;
    private _noChatSelectedPanel: Node;

    constructor(chat: IChat, wsManager: IWsManager, chatMessagePanel: ChatMessagePanel, noChatSelectedPanel: Node) {
        this._chat = chat;
        this._wsManager = wsManager;
        this._chatMessagePanel = chatMessagePanel;
        this._noChatSelectedPanel = noChatSelectedPanel;

        this._setActivePanel(PanelType.NONE);
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }

    activate() {
        this._chat.eventTarget.on(EventConstants.CHAT_SET_ACTIVE, this._onActiveChatSet, this);
        this._wsManager.eventTarget.on(EventConstants.WS_GOT_MESSAGE, this._onGotMessage, this);
        this._chatMessagePanel.sendButton.node.on(UiConstants.buttonClickEvent, this._onSendButtonClicked, this);
        this._chatMessagePanel.messageText.node.on(UiConstants.editingReturn, this._onSendButtonClicked, this);

        let activePanel = this._chat.hasActiveChat ? PanelType.CHAT_SELECTED : PanelType.NOT_SELECTED;
        this._setActivePanel(activePanel);
    }

    deactivate() {
        this._chat.eventTarget.off(EventConstants.CHAT_SET_ACTIVE, this._onActiveChatSet, this);
        this._wsManager.eventTarget.off(EventConstants.WS_GOT_MESSAGE, this._onGotMessage, this);
        this._chatMessagePanel.sendButton.node.off(UiConstants.buttonClickEvent, this._onSendButtonClicked, this);
        this._chatMessagePanel.messageText.node.off(UiConstants.editingReturn, this._onSendButtonClicked, this);

        this._setActivePanel(PanelType.NONE);
    }

    // ================== MODEL CALLBACKS ==================

    private _onActiveChatSet(messages: IMessageInfo[]) {
        this._setActivePanel(PanelType.CHAT_SELECTED);
        this._chatMessagePanel.setChatName(this._chat.activeChat.title);
        this._chatMessagePanel.refreshMessages(messages);
    }

    private _onGotMessage(message: string) {
        let resp = JSON.parse(message);
        if (resp["cmd"] != MessageCommand.MESSAGE) {
            return;
        }

        let payload = resp["payload"]
        let chatId: number = payload["chat_id"]
        if (!this._chat.hasActiveChat || chatId != this._chat.activeChat.id) {
            return;
        }

        let data = MessageHelper.parseMessage(payload, this._userSession.userId);
        this._chatMessagePanel.appendMessage(data, true);
        this._chatMessagePanel.messageText.focus();
    }

    // ================== UI CALLBACKS ==================

    private _onSendButtonClicked() {
        let message = this._chatMessagePanel.messageText.string.trim();
        this._chatMessagePanel.messageText.string = "";
        if (message == "") {
            return;
        }

        this._wsManager.writeMessage(this._chat.activeChat.id, message);
    }

    // ================== SWITCHING PANELS ==================

    private _setActivePanel(panelType: PanelType) {
        switch (panelType) {
            case PanelType.NONE: {
                this._chatMessagePanel.node.active = false;
                this._noChatSelectedPanel.active = false;
                break;
            }
            case PanelType.NOT_SELECTED: {
                this._noChatSelectedPanel.active = true;
                this._chatMessagePanel.node.active = false;
                break;
            }
            case PanelType.CHAT_SELECTED: {
                this._chatMessagePanel.node.active = true;
                this._noChatSelectedPanel.active = false
                break;
            }
        }
    }
}