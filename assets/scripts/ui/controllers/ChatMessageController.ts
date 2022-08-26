import { UserSession } from "../../network/auth/UserSession";
import { ChatMessagePanel } from "../panels/chat/ChatMessagePanel";
import { ISessionController } from "./ISessionController";
import { Node } from "cc"; 

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