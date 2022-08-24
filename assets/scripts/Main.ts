import { _decorator, Component, Node } from 'cc';
import { IAuth, Auth } from './network/auth/Auth';
import { AuthController } from './ui/controllers/AuthController';
import { AuthPanel } from './ui/panels/AuthPanel';
import { InfoPanel } from './ui/panels/InfoPanel';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property
    serverUrl: string = "";

    @property({type:AuthPanel})
    authPanel: AuthPanel = null;
    @property({type:InfoPanel})
    infoPanel: InfoPanel = null;

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
        this._authController = new AuthController(this._auth, this.authPanel, this.infoPanel, this.serverUrl);
    }
}

