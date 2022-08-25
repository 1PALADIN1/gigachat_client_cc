import { IDisposable } from "../../IDisposable";
import { ApiConstants } from "../ApiConstants";
import { UserSession } from "../auth/UserSession";
import { EventTarget } from 'cc';

export interface IConnectionManager extends IDisposable {
    wsResultEvent: EventTarget;

    isActive();
    connect(userSession: UserSession, callback: (result: boolean, message: string) => void);
}

export enum WsResultEvent {
    ERROR = "error",
    GOT_MESSAGE = "got_message",
    CLOSED = "closed"
}

export class ConnectionManager implements IConnectionManager {
    private _userSession: UserSession;
    private _ws: WebSocket;

    wsResultEvent: EventTarget;

    constructor() {
        this.wsResultEvent = new EventTarget();
    }

    isActive() {
        return this._userSession != null
    }

    connect(userSession: UserSession, callback: (result: boolean, message: string) => void) {
        if (this.isActive()) {
            callback(false, "Ws manager is already active!");
            return;
        }

        let clb = callback;

        this._userSession = userSession;
        let url = ApiConstants.buildWsAddr(this._userSession.baseServerUrl, ApiConstants.WS_ROUTE) + "/" + this._userSession.token;
        this._ws = new WebSocket(url);

        this._ws.onopen = (event) => {
            if (clb != null) {
                console.log("WS connected");
                callback(true, null);
                clb = null;
            }
        };

        this._ws.onerror = (event) => {
            if (clb != null) {
                callback(false, "Error in ws connection");
                clb = null;
                return;
            }

            this.wsResultEvent.emit(WsResultEvent.ERROR, "Got error from connection")
        };

        this._ws.onclose = (event) => {
            this.wsResultEvent.emit(WsResultEvent.CLOSED, "WebSocket instance closed");
            this._userSession = null;
        };

        this._ws.onmessage = (event) => {
            console.log("response text msg: " + event.data); //TODO
            this.wsResultEvent.emit(WsResultEvent.GOT_MESSAGE, event.data);
        };
    }

    dispose() {
        if (!this.isActive()) {
            return;
        }

        this._ws.close(1000, "closed by client");
    }
}