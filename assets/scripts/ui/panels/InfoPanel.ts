import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InfoPanel')
export class InfoPanel extends Component {
    @property({type:Label})
    messageLabel: Label = null;

    setMessage(message: string) {
        this.messageLabel.string = message;
    }
}

