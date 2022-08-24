import { IDisposable } from "../../IDisposable";
import { AuthEventType, IAuth } from "../../network/auth/Auth";
import { UserSession } from "../../network/auth/UserSession";
import { AuthPanel } from "../panels/AuthPanel";
import { InfoPanel } from "../panels/InfoPanel";

enum PanelType {
    NONE,
    AUTH,
    INFO
}

const connectingMessage: string = "Connecting...";

export class AuthController implements IDisposable {
    private _auth: IAuth;

    private _authPanel: AuthPanel;
    private _infoPanel: InfoPanel;

    private _defaultServerUrl: string;

    constructor(auth: IAuth, authPanel: AuthPanel, infoPanel: InfoPanel, defaultServerUrl: string) {
        this._auth = auth;
        this._authPanel = authPanel;
        this._infoPanel = infoPanel;
        this._defaultServerUrl = defaultServerUrl;

        //auth model
        this._auth.authResultEvent.on(AuthEventType.SIGN_IN_SUCCESS, this._signInSuccess, this);
        this._auth.authResultEvent.on(AuthEventType.SIGN_UP_SUCCESS, this._signUpSuccess, this);
        this._auth.authResultEvent.on(AuthEventType.ERROR, this._authError, this);
        //auth panel buttons
        this._authPanel.loginButton.node.on("click", this._onSignInClicked, this);

        this._auth.baseUrl = this._defaultServerUrl;
        this._authPanel.setServerUrl(this._defaultServerUrl);

        this._authPanel.usernameText.string = "username" //TODO: for debug
        this._authPanel.passwordText.string = "password"; //TODO: for debug

        this._setActivePanel(PanelType.NONE);
    }

    dispose() {
        //auth model
        this._auth.authResultEvent.off(AuthEventType.SIGN_IN_SUCCESS, this._signInSuccess, this);
        this._auth.authResultEvent.off(AuthEventType.SIGN_UP_SUCCESS, this._signUpSuccess, this);
        this._auth.authResultEvent.off(AuthEventType.ERROR, this._authError, this);
        //auth panel buttons
        this._authPanel.loginButton.node.off("click", this._onSignInClicked, this);
    }

    authUser() {
        this._setActivePanel(PanelType.AUTH);
    }

    private _onSignInClicked() {
        let username = this._authPanel.usernameText.string.trim();
        let password = this._authPanel.passwordText.string.trim();

        if (username == "") {
            console.error("Username is not set!");
            return;
        }

        if (password == "") {
            console.error("Password is not set!");
            return;
        }

        this._setActivePanel(PanelType.INFO);
        this._auth.signInUser(username, password);
    }

    // ================== AUTH RESULTS ==================

    private _signInSuccess(mesasge: string) {
        let session = new UserSession(mesasge);
        console.log("Sign in success! Token: " + session.token);
        this._setActivePanel(PanelType.NONE);
    }

    private _signUpSuccess(message: string) {
        console.log("Sign up success! " + message);
        this._setActivePanel(PanelType.AUTH);
    }

    private _authError(message: string) {
        console.error("Error: " + message);
        this._setActivePanel(PanelType.AUTH);
    }

    // ================== HELPERS ==================

    private _setActivePanel(panelType: PanelType) {
        switch (panelType) {
            case PanelType.NONE: {
                this._authPanel.node.active = false;
                this._infoPanel.node.active = false;
                break;
            }
            case PanelType.AUTH: {
                this._authPanel.node.active = true;
                this._infoPanel.node.active = false;
                break;
            }
            case PanelType.INFO: {
                this._authPanel.node.active = false;
                this._infoPanel.node.active = true;
                this._infoPanel.setMessage(connectingMessage);
                break;
            }
        }
    }
}