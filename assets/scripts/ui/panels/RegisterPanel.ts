import { _decorator, Component, Node, EditBox, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RegisterPanel')
export class RegisterPanel extends Component {
    @property({ type: EditBox })
    usernameText: EditBox = null;
    @property({ type: EditBox })
    passwordText: EditBox = null;
    @property({ type: EditBox })
    confirmPasswordText: EditBox = null;

    @property({ type: Button })
    registerButton: Button = null;
    @property({ type: Button })
    closeButton: Button = null;

    clearEditBoxes() {
        this.usernameText.string = "";
        this.passwordText.string = "";
        this.confirmPasswordText.string = "";
    }
}

