import { UserSession } from "../../network/auth/UserSession";
import { ChatMessagePanel } from "../panels/chat/ChatMessagePanel";
import { ISessionController } from "./ISessionController";
import { Node } from "cc"; 
import { IChat } from "../../chat/Chat";
import { EventConstants } from "../../EventConstants";
import { IMessageInfo } from "../../entity/IMessageInfo";

enum PanelType {
    NONE,
    NOT_SELECTED,
    CHAT_SELECTED
}

export class ChatMessageController implements ISessionController {
    private _userSession: UserSession; //TODO: use model
    private _chat: IChat;

    private _chatMessagePanel: ChatMessagePanel;
    private _noChatSelectedPanel: Node;

    constructor(chat: IChat, chatMessagePanel: ChatMessagePanel, noChatSelectedPanel: Node) {
        this._chat = chat;
        this._chatMessagePanel = chatMessagePanel;
        this._noChatSelectedPanel = noChatSelectedPanel;

        this._setActivePanel(PanelType.NONE);
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }

    activate() {
        this._chat.eventTarget.on(EventConstants.CHAT_SET_ACTIVE, this._onActiveChatSet, this);

        let activePanel = this._chat.hasActiveChat ? PanelType.CHAT_SELECTED : PanelType.NOT_SELECTED;
        this._setActivePanel(activePanel);
    }

    deactivate() {
        this._chat.eventTarget.off(EventConstants.CHAT_SET_ACTIVE, this._onActiveChatSet, this);

        this._setActivePanel(PanelType.NONE);
    }

    // ================== MODEL CALLBACKS ==================

    private _onActiveChatSet() {
        this._setActivePanel(PanelType.CHAT_SELECTED);
        this._chatMessagePanel.setChatName(this._chat.activeChat.title);

        //TODO
        this._chatMessagePanel.chatNameLabel.string = "NICE CHAT";
        let testMessages: IMessageInfo[] = [
            {
                message: "Hello dude! How are you?",
                sendTime: "11:20 23.01.2020",
                userId: 1,
                username: "Nice BOY 11",
                isUser: false
            },
            {
                message: "Hello dude! How are you?",
                sendTime: "11:21 23.01.2020",
                userId: 1,
                username: "Nice BOY 11",
                isUser: false
            },
            {
                message: "Hi!",
                sendTime: "11:23 23.01.2020",
                userId: 2,
                username: "Me",
                isUser: true
            },
            {
                message: "Fine! thanks",
                sendTime: "11:24 23.01.2020",
                userId: 2,
                username: "Me",
                isUser: true
            },
            {
                message: "Nice to hear that",
                sendTime: "11:24 23.01.2020",
                userId: 1,
                username: "Nice BOY 11",
                isUser: false
            },
            {
                message: "Bla bla bla",
                sendTime: "11:25 23.01.2020",
                userId: 1,
                username: "Nice BOY 11",
                isUser: false
            },
        ];
        this._chatMessagePanel.refreshMessages(testMessages);
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