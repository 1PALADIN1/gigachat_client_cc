import { _decorator, Component, Node } from 'cc';
import { IAuth, Auth } from './network/auth/Auth';
import { AuthController } from './ui/controllers/AuthController';
import { AuthPanel } from './ui/panels/auth/AuthPanel';
import { InfoPanel } from './ui/panels/InfoPanel';
import { RegisterPanel } from './ui/panels/auth/RegisterPanel';
import { UserController } from './ui/controllers/UserController';
import { IWsManager, WsManager } from './network/ws/WsManager';
import { UserSession } from './network/auth/UserSession';
import { SearchButtonPanel } from './ui/panels/user/SearchButtonPanel';
import { SearchUserPanel } from './ui/panels/user/SearchUserPanel';
import { HttpRequestMaker } from './network/HttpRequestMaker';
import { ChatController } from './ui/controllers/ChatController';
import { ChatPanel } from './ui/panels/chat/ChatPanel';
import { ChatMessageController } from './ui/controllers/ChatMessageController';
import { ChatMessagePanel } from './ui/panels/chat/ChatMessagePanel';
import { Chat, IChat } from './chat/Chat';
import { EventConstants } from './EventConstants';
import { IUser, User } from './user/User';
import { LogOutButtonPanel } from './ui/panels/user/LogOutButtonPanel';
import { ErrorPanel } from './ui/panels/ErrorPanel';
const { ccclass, property } = _decorator;

const panelsGroup: string = "Panels";

@ccclass('Main')
export class Main extends Component {

    @property
    serverUrl: string = "";

    //panels
    //auth
    @property({
        group: {
            name: panelsGroup
        },
        type: AuthPanel
    })
    authPanel: AuthPanel = null;
    @property({
        group: {
            name: panelsGroup
        },
        type: RegisterPanel
    })
    registerPanel: RegisterPanel = null;

    //user
    @property({
        group: {
            name: panelsGroup
        },
        type: SearchButtonPanel
    })
    searchButtonPanel: SearchButtonPanel = null;
    @property({
        group: {
            name: panelsGroup
        },
        type: SearchUserPanel
    })
    searchUserPanel: SearchUserPanel = null;
    @property({
        group: {
            name: panelsGroup
        },
        type: LogOutButtonPanel
    })
    logOutButtonPanel: LogOutButtonPanel = null;

    //chat
    @property({
        group: {
            name: panelsGroup
        },
        type: ChatPanel
    })
    chatPanel: ChatPanel = null;
    @property({
        group: {
            name: panelsGroup
        },
        type: ChatMessagePanel
    })
    chatMessagePanel: ChatMessagePanel = null;
    @property({
        group: {
            name: panelsGroup
        },
        type: Node
    })
    noChatSelectedPanel: Node = null;

    //other
    @property({
        group: {
            name: panelsGroup
        },
        type: InfoPanel
    })
    infoPanel: InfoPanel = null;
    @property({
        group: {
            name: panelsGroup
        },
        type: ErrorPanel
    })
    errorPanel: ErrorPanel = null;

    //models
    private _auth: IAuth;
    private _chat: IChat;
    private _user: IUser;
    private _wsManager: IWsManager;
    private _httpRequestMaker: HttpRequestMaker;
    //controllers
    private _authController: AuthController;
    private _chatController: ChatController;
    private _chatMessageController: ChatMessageController;
    private _userController: UserController;

    start() {
        this._buildUp();
        this._startAuth();
    }

    onDestroy() {
        this._wsManager.dispose();

        this._authController.deactivate();
        this._chatController.deactivate();
        this._chatMessageController.deactivate();
        this._userController.deactivate();
    }

    private _buildUp() {
        this._wsManager = new WsManager();
        this._httpRequestMaker = new HttpRequestMaker();
        this._auth = new Auth(this._httpRequestMaker);
        this._chat = new Chat(this._httpRequestMaker);
        this._user = new User(this._httpRequestMaker);

        this._authController = new AuthController(this._auth, this.authPanel, this.registerPanel, this.infoPanel, this.serverUrl);
        this._userController = new UserController(this._chat, this._user, this._wsManager, this.searchButtonPanel, this.searchUserPanel, this.logOutButtonPanel);
        this._chatController = new ChatController(this._chat, this._wsManager, this.chatPanel);
        this._chatMessageController = new ChatMessageController(this._chat, this._wsManager, this.chatMessagePanel, this.noChatSelectedPanel);
    }

    private _startAuth() {
        this._authController.authResultEvent.on(EventConstants.AUTH_SUCCESS, this._onAuthSuccess, this);
        this._authController.authResultEvent.on(EventConstants.AUTH_ERROR, this._displayError, this);
        this._authController.activate();
    }

    private _onAuthSuccess(userSession: UserSession) {
        this._authController.authResultEvent.off(EventConstants.AUTH_SUCCESS, this._onAuthSuccess, this);
        this._authController.authResultEvent.off(EventConstants.AUTH_ERROR, this._displayError, this);
        this._authController.deactivate();

        this._wsManager.connect(userSession, (result, message) => {
            if (!result) {
                console.error(message);
                this._displayError(message);
                this._startAuth();
                return;
            }

            this._chat.bindSession(userSession);
            this._user.bindSession(userSession);

            //listen connection events
            this._wsManager.eventTarget.on(EventConstants.WS_ERROR, this._disconnected, this);
            this._wsManager.eventTarget.on(EventConstants.WS_CLOSED, this._disconnected, this);
            this._userController.eventTarget.on(EventConstants.USER_ERROR, this._displayError, this);

            //activate controllers
            this._chatController.activate();
            this._chatMessageController.activate();
            this._chatMessageController.bindSession(userSession);
            this._userController.activate();
        });
    }

    private _displayError(message: string) {
        this.errorPanel.display(message);
    }

    private _disconnected(message: string) {
        console.log("Connection closed: " + message);

        this._wsManager.eventTarget.off(EventConstants.WS_ERROR, this._disconnected, this);
        this._wsManager.eventTarget.off(EventConstants.WS_CLOSED, this._disconnected, this);
        this._userController.eventTarget.off(EventConstants.USER_ERROR, this._displayError, this);

        //deactivate controllers
        this._chatController.deactivate();
        this._chatMessageController.deactivate();
        this._userController.deactivate();
        
        this._startAuth();
    }
}

