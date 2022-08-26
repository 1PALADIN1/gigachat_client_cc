import { UserSession } from "../../network/auth/UserSession";
import { ChatMessagePanel } from "../panels/chat/ChatMessagePanel";
import { ISessionController } from "./ISessionController";
import { Node } from "cc"; 
import { IMessageInfo } from "../../entity/IMessageInfo";

enum PanelType {
    NONE,
    NOT_SELECTED,
    CHAT_SELECTED
}

export class ChatMessageController implements ISessionController {
    private _userSession: UserSession;

    private _chatMessagePanel: ChatMessagePanel;
    private _noChatSelectedPanel: Node;

    constructor(chatMessagePanel: ChatMessagePanel, noChatSelectedPanel: Node) {
        this._chatMessagePanel = chatMessagePanel;
        this._noChatSelectedPanel = noChatSelectedPanel;

        this._setActivePanel(PanelType.NONE);
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }

    activate() {
        this._setActivePanel(PanelType.CHAT_SELECTED);

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

    deactivate() {
        this._setActivePanel(PanelType.NONE);
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