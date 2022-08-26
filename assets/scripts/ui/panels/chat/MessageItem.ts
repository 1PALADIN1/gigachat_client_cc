import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MessageItem')
export class MessageItem extends Component {
    @property({
        type: Label
    })
    usernameLabel: Label = null;
    @property({
        type: Label
    })
    messageLabel: Label = null;
    @property({
        type: Label
    })
    timeLabel: Label = null;

    setup(username: string, message: string, time: string) {
        this.usernameLabel.string = username;
        this.messageLabel.string = message;
        this.timeLabel.string = time;
    }
}

