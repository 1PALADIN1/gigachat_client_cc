import { _decorator, Component, Node, Label, Button, EventTarget } from 'cc';
import { UiConstants } from '../../UiConstants';
const { ccclass, property } = _decorator;

@ccclass('SearchResultsItem')
export class SearchResultsItem extends Component {
    startChatEvent: EventTarget = new EventTarget();

    @property({
        type: Label
    })
    usernameLabel: Label = null;
    @property({
        type: Button
    })
    writeButton: Button = null;

    private _userId: number;
    private _username: string;

    onLoad() {
        this.writeButton.node.on(UiConstants.buttonClickEvent, this._onWriteButtonClicked, this);
    }

    onDestroy() {
        if (this.writeButton.node != null) {
            this.writeButton.node.off(UiConstants.buttonClickEvent, this._onWriteButtonClicked, this);
        }
    }

    setup(userId: number, username: string) {
        this._userId = userId;
        this._username = username;
        this.usernameLabel.string = username;
    }

    private _onWriteButtonClicked() {
        this.startChatEvent.emit(UiConstants.startChatEvent, this._userId, this._username);
    }
}

