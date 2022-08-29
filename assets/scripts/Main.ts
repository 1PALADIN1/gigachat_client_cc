import { _decorator, Component, Node } from 'cc';
import { IAuth, Auth } from './network/auth/Auth';
import { AuthController, AuthResultEvent } from './ui/controllers/AuthController';
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
import { ISessionController } from './ui/controllers/ISessionController';
import { ChatPanel } from './ui/panels/chat/ChatPanel';
import { ChatMessageController } from './ui/controllers/ChatMessageController';
import { ChatMessagePanel } from './ui/panels/chat/ChatMessagePanel';
import { Chat, IChat } from './chat/Chat';
import { EventConstants } from './EventConstants';
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

    //models
    private _auth: IAuth;
    private _chat: IChat;
    private _wsManager: IWsManager;
    private _httpRequestMaker: HttpRequestMaker;
    //controllers
    private _authController: AuthController;
    private _sessionControllers: Array<ISessionController>;

    start() {
        this._buildUp();
        this._startAuth();
    }

    onDestroy() {
        this._wsManager.dispose();

        this._authController.deactivate();
        for (let i = 0; i < this._sessionControllers.length; i++) {
            this._sessionControllers[i].deactivate();
        }
    }

    private _buildUp() {
        this._wsManager = new WsManager();
        this._httpRequestMaker = new HttpRequestMaker();
        this._auth = new Auth(this._httpRequestMaker);
        this._chat = new Chat(this._httpRequestMaker);

        this._authController = new AuthController(this._auth, this.authPanel, this.registerPanel, this.infoPanel, this.serverUrl);

        this._sessionControllers = [
            new UserController(this._chat, this._httpRequestMaker, this.searchButtonPanel, this.searchUserPanel),
            new ChatController(this._chat, this._wsManager, this.chatPanel),
            new ChatMessageController(this._chat, this._wsManager, this.chatMessagePanel, this.noChatSelectedPanel)
        ]
    }

    private _startAuth() {
        this._authController.authResultEvent.on(AuthResultEvent.SUCCESS, this._onAuthSuccess, this);
        this._authController.activate();
    }

    private _onAuthSuccess(userSession: UserSession) {
        this._authController.authResultEvent.off(AuthResultEvent.SUCCESS, this._onAuthSuccess, this);
        this._authController.deactivate();

        this._wsManager.connect(userSession, (result, message) => {
            if (!result) {
                console.error(message);
                this._startAuth();
                return;
            }

            this._chat.bindSession(userSession);

            //listen connection events
            this._wsManager.eventTarget.on(EventConstants.WS_ERROR, this._disconnected, this);
            this._wsManager.eventTarget.on(EventConstants.WS_CLOSED, this._disconnected, this);

            //activate controllers
            for (let i = 0; i < this._sessionControllers.length; i++) {
                let controller = this._sessionControllers[i];
                controller.bindSession(userSession);
                controller.activate();
            }
        });
    }

    private _disconnected(message: string) {
        console.log("Connection closed: " + message);

        this._wsManager.eventTarget.off(EventConstants.WS_ERROR, this._disconnected, this);
        this._wsManager.eventTarget.off(EventConstants.WS_CLOSED, this._disconnected, this);

        //deactivate controllers
        for (let i = 0; i < this._sessionControllers.length; i++) {
            this._sessionControllers[i].deactivate();
        }
        
        this._startAuth();
    }
}

