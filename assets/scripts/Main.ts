import { _decorator, Component, Node } from 'cc';
import { IAuth, Auth } from './network/auth/Auth';
import { AuthController, AuthResultEvent } from './ui/controllers/AuthController';
import { AuthPanel } from './ui/panels/auth/AuthPanel';
import { InfoPanel } from './ui/panels/InfoPanel';
import { RegisterPanel } from './ui/panels/auth/RegisterPanel';
import { UserController } from './ui/controllers/UserController';
import { IConnectionManager, ConnectionManager } from './network/ws/ConnectionManager';
import { UserSession } from './network/auth/UserSession';
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

    //models
    private _auth: IAuth;
    private _connectionManager: IConnectionManager;
    //controllers
    private _authController: AuthController;
    private _userController: UserController;

    start() {
        this._buildUp();
        this._startAuth();
    }

    onDestroy() {
        this._connectionManager.dispose();

        this._authController.deactivate();
    }

    private _buildUp() {
        this._auth = new Auth();
        this._connectionManager = new ConnectionManager();

        this._authController = new AuthController(this._auth, this.authPanel, this.registerPanel, this.infoPanel, this.serverUrl);
        this._userController = new UserController();
    }

    private _startAuth() {
        this._authController.authResultEvent.on(AuthResultEvent.SUCCESS, this._onAuthSuccess, this);
        this._authController.activate();
    }

    private _onAuthSuccess(userSession: UserSession) {
        this._authController.authResultEvent.off(AuthResultEvent.SUCCESS, this._onAuthSuccess, this);
        this._authController.deactivate();

        this._connectionManager.connect(userSession, (result, message) => {
            if (!result) {
                console.error(message);
                this._startAuth();
                return;
            }

        });
    }
}

