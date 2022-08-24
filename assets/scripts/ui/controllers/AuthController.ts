import { IDisposable } from "../../IDisposable";
import { AuthEventType, IAuth } from "../../network/auth/Auth";
import { UserSession } from "../../network/auth/UserSession";
import { AuthPanel } from "../panels/AuthPanel";
import { InfoPanel } from "../panels/InfoPanel";
import { RegisterPanel } from "../panels/RegisterPanel";

enum PanelType {
    NONE,
    AUTH,
    REGISTER,
    INFO
}

const connectingMessage: string = "Connecting...";
const buttonClickEvent: string = "click";

export class AuthController implements IDisposable {
    private _auth: IAuth;

    private _authPanel: AuthPanel;
    private _registerPanel: RegisterPanel;
    private _infoPanel: InfoPanel;

    private _defaultServerUrl: string;

    private _activePanelType?:  PanelType;

    constructor(auth: IAuth, authPanel: AuthPanel, registerPanel: RegisterPanel, infoPanel: InfoPanel, defaultServerUrl: string) {
        this._auth = auth;
        this._authPanel = authPanel;
        this._registerPanel = registerPanel;
        this._infoPanel = infoPanel;
        this._defaultServerUrl = defaultServerUrl;

        //auth model
        this._auth.authResultEvent.on(AuthEventType.SIGN_IN_SUCCESS, this._signInSuccess, this);
        this._auth.authResultEvent.on(AuthEventType.SIGN_UP_SUCCESS, this._signUpSuccess, this);
        this._auth.authResultEvent.on(AuthEventType.ERROR, this._authError, this);
        //auth panel buttons
        this._authPanel.loginButton.node.on(buttonClickEvent, this._onSignInClicked, this);
        this._authPanel.registerButton.node.on(buttonClickEvent, this._onMoveToRegisterClicked, this);
        //register panel buttons
        this._registerPanel.closeButton.node.on(buttonClickEvent, this._onSignUpClosed, this);
        this._registerPanel.registerButton.node.on(buttonClickEvent, this._onSignUpClicked, this);

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
        this._authPanel.loginButton.node.off(buttonClickEvent, this._onSignInClicked, this);
        this._authPanel.registerButton.node.off(buttonClickEvent, this._onMoveToRegisterClicked, this);
        //register panel buttons
        this._registerPanel.closeButton.node.off(buttonClickEvent, this._onSignUpClosed, this);
        this._registerPanel.registerButton.node.off(buttonClickEvent, this._onSignUpClicked, this);
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

        this._activePanelType = PanelType.AUTH;
        this._setActivePanel(PanelType.INFO);
        this._auth.baseUrl = this._authPanel.serverUrlText.string;
        this._auth.signInUser(username, password);
    }

    private _onSignUpClicked() {
        let username = this._registerPanel.usernameText.string.trim();
        let password = this._registerPanel.passwordText.string.trim();
        let confirmPassword = this._registerPanel.confirmPasswordText.string.trim();

        if (username == "") {
            console.error("Username is not set!");
            return;
        }

        if (password == "") {
            console.error("Password is not set!");
            return;
        }

        if (password != confirmPassword) {
            console.error("Passwords do not match!");
            return;
        }

        this._activePanelType = PanelType.REGISTER;
        this._setActivePanel(PanelType.INFO);
        this._auth.signUpUser(username, password);
    }

    private _onMoveToRegisterClicked() {
        this._setActivePanel(PanelType.REGISTER);
    }

    private _onSignUpClosed() {
        this._setActivePanel(PanelType.AUTH);
    }

    // ================== AUTH RESULTS ==================

    private _signInSuccess(mesasge: string) {
        let session = new UserSession(mesasge);
        console.log("Sign in success! Token: " + session.token);
        this._setActivePanel(PanelType.NONE);
        this._authPanel.clearEditBoxes();
    }

    private _signUpSuccess(message: string) {
        console.log("Sign up success! " + message);
        this._setActivePanel(PanelType.AUTH);
        this._registerPanel.clearEditBoxes();
    }

    private _authError(message: string) {
        console.error("Error: " + message);

        if (this._activePanelType == null) {
            this._setActivePanel(PanelType.AUTH);
            return;
        }

        this._setActivePanel(this._activePanelType);
    }

    // ================== HELPERS ==================

    private _setActivePanel(panelType: PanelType) {
        switch (panelType) {
            case PanelType.NONE: {
                this._authPanel.node.active = false;
                this._infoPanel.node.active = false;
                this._registerPanel.node.active = false;
                break;
            }
            case PanelType.AUTH: {
                this._authPanel.node.active = true;
                this._infoPanel.node.active = false;
                this._registerPanel.node.active = false;
                break;
            }
            case PanelType.INFO: {
                this._infoPanel.node.active = true;
                this._authPanel.node.active = false;
                this._registerPanel.node.active = false;

                this._infoPanel.setMessage(connectingMessage);
                break;
            }
            case PanelType.REGISTER: {
                this._registerPanel.node.active = true;
                this._infoPanel.node.active = false;
                this._authPanel.node.active = false;
                break;
            }
        }
    }
}