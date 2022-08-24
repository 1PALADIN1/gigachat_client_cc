import { _decorator, Component, Node } from 'cc';
import { IAuth, Auth, AuthEventType } from './network/auth/Auth';
import { UserSession } from './network/auth/UserSession';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    @property
    serverUrl: string = "";

    private _auth: IAuth;

    start() {
        this._auth = new Auth(this.serverUrl);
        this._auth.authResultEvent.on(AuthEventType.SIGN_IN_SUCCESS, this._signInSuccess, this);
        this._auth.authResultEvent.on(AuthEventType.SIGN_UP_SUCCESS, this._signUpSuccess, this);
        this._auth.authResultEvent.on(AuthEventType.ERROR, this._authError, this);

        this._auth.signInUser("username", "password"); //TODO
    }

    onDestroy() {
        if (this._auth == null) {
            return;
        }

        this._auth.authResultEvent.off(AuthEventType.SIGN_IN_SUCCESS, this._signInSuccess, this);
        this._auth.authResultEvent.off(AuthEventType.SIGN_UP_SUCCESS, this._signUpSuccess, this);
        this._auth.authResultEvent.off(AuthEventType.ERROR, this._authError, this);
    }

    private _signInSuccess(session: UserSession) {
        console.log("Sign in success! Token: " + session.token);
    }

    private _signUpSuccess(message: string) {
        console.log("Sign up success! " + message);
    }

    private _authError(message: string) {
        console.error("Error: " + message);
    }
}

