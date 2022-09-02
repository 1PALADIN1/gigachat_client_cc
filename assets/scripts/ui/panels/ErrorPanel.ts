import { _decorator, Component, Node, Label, Button } from 'cc';
import { UiConstants } from '../UiConstants';
const { ccclass, property } = _decorator;

@ccclass('ErrorPanel')
export class ErrorPanel extends Component {
    @property({
        type: Label
    })
    messageLabel: Label = null;
    @property({
        type: Button
    })
    closeButton: Button = null;

    start() {
        this.closeButton.node.on(UiConstants.buttonClickEvent, this._onCloseButtonClicked, this);
        this.node.active = false;
    }

    onDestroy() {
        if (this.closeButton.node != null) {
            this.closeButton.node.off(UiConstants.buttonClickEvent, this._onCloseButtonClicked, this);
        }
    }

    display(message: string) {
        this.messageLabel.string = message;
        this.node.active = true;
    }

    private _onCloseButtonClicked() {
        this.node.active = false;
    }
}

