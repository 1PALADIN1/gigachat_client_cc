import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SearchButtonPanel')
export class SearchButtonPanel extends Component {
    @property({
        type: Button
    })
    searchButton: Button = null;
}

