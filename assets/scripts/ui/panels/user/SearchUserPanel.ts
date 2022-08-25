import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SearchUserPanel')
export class SearchUserPanel extends Component {
    @property({
        type: Button
    })
    closeButton: Button = null;
}

