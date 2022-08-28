import { _decorator, Component, Node, Label, Button, EventTarget } from 'cc';
import { IChatInfo } from '../../../entity/IChatInfo';
import { EventConstants } from '../../../EventConstants';
import { UiConstants } from '../../UiConstants';
const { ccclass, property } = _decorator;

const noMessageText = "No messages in the chat";

@ccclass('ChatItem')
export class ChatItem extends Component {
    eventTarget: EventTarget = new EventTarget();

    @property({
        type: Label
    })
    usernameLabel: Label = null;

    @property({
        type: Label
    })
    lastMessageLabel: Label = null;

    @property({
        type: Button
    })
    selectButton: Button = null;

    private _chat: IChatInfo;

    start() {
        this.selectButton.node.on(UiConstants.buttonClickEvent, this._onChatSelected, this);
    }

    onDestroy() {
        if (this.selectButton.node != null) {
            this.selectButton.node.off(UiConstants.buttonClickEvent, this._onChatSelected, this);
        }
    }

    setup(chat: IChatInfo, username: string, lastMessage: string) {
        this._chat = chat;
        this.usernameLabel.string = username;
        this.lastMessageLabel.string = lastMessage == "" ? noMessageText : lastMessage;
    }

    private _onChatSelected() {
        if (this._chat == null) {
            console.error("Chat is not setup!");
            return;
        }

        this.eventTarget.emit(EventConstants.CHAT_SELECTED, this._chat);
    }
}

