import { _decorator, Component, Node, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LogOutButtonPanel')
export class LogOutButtonPanel extends Component {

    @property({
        type: Button
    })
    logOutButton: Button = null;
}

