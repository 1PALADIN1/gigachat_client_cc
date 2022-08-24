import { _decorator, Component, Node } from 'cc';
import { IAuth, Auth } from './network/auth/Auth';
import { AuthController } from './ui/controllers/AuthController';
import { AuthPanel } from './ui/panels/AuthPanel';
import { InfoPanel } from './ui/panels/InfoPanel';
import { RegisterPanel } from './ui/panels/RegisterPanel';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property
    serverUrl: string = "";

    @property({ group: {name: "Panels"}, type: AuthPanel })
    authPanel: AuthPanel = null;
    @property({ group: {name: "Panels"}, type: InfoPanel })
    infoPanel: InfoPanel = null;
    @property({ group: {name: "Panels"}, type: RegisterPanel })
    registerPanel: RegisterPanel = null;

    private _auth: IAuth;
    private _authController: AuthController;

    start() {
        this._buildUpDependencies();

        this._authController.authUser();
    }

    onDestroy() {
        this._authController.dispose();
    }

    private _buildUpDependencies() {
        this._auth = new Auth();
        this._authController = new AuthController(this._auth, this.authPanel, this.registerPanel, this.infoPanel, this.serverUrl);
    }
}

