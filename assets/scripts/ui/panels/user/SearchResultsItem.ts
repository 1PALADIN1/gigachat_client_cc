import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SearchResultsItem')
export class SearchResultsItem extends Component {
    @property({
        type: Label
    })
    usernameLabel: Label = null;
    @property({
        type: Button
    })
    writeButton: Button = null;

    private _userId: number;

    setup(userId: number, username: string) {
        this._userId = userId;
        this.usernameLabel.string = username;
    }
    
    //TODO: onclick event -> start user chat
}

