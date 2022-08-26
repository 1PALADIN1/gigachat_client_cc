import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

const noMessageText = "No messages in the chat";

@ccclass('ChatItem')
export class ChatItem extends Component {
    @property({
        type: Label
    })
    usernameLabel: Label = null;

    @property({
        type: Label
    })
    lastMessageLabel: Label = null;

    private _chatId: number;

    setup(chatId: number, username: string, lastMessage: string) {
        this._chatId = chatId;
        this.usernameLabel.string = username;
        this.lastMessageLabel.string = lastMessage == "" ? noMessageText : lastMessage;
    }

    //TODO: onclick
}

