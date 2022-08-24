import { _decorator, Component, Node, EditBox, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AuthPanel')
export class AuthPanel extends Component {

    @property({type:EditBox})
    usernameText: EditBox = null;
    @property({type:EditBox})
    passwordText: EditBox = null;
    @property({type:EditBox})
    serverUrlText: EditBox = null;
    
    @property({type:Button})
    loginButton: Button = null;
    @property({type:Button})
    registerButton: Button = null;

    setServerUrl(url: string) {
        this.serverUrlText.string = url;
    }

    clearEditBoxes() {
        this.usernameText.string = "";
        this.passwordText.string = "";
    }
}

