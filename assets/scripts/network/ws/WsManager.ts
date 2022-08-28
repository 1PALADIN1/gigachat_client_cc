import { IDisposable } from "../../IDisposable";
import { ApiConstants } from "../ApiConstants";
import { UserSession } from "../auth/UserSession";
import { EventTarget } from 'cc';
import { EventConstants } from "../../EventConstants";

export interface IWsManager extends IDisposable {
    eventTarget: EventTarget;

    isActive();
    connect(userSession: UserSession, callback: (result: boolean, message: string) => void);
    writeMessage(chat_id: number, message: string);
}

export class WsManager implements IWsManager {
    private _userSession: UserSession;
    private _ws: WebSocket;

    eventTarget: EventTarget = new EventTarget();

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

            this.eventTarget.emit(EventConstants.WS_ERROR, "Got error from connection")
        };

        this._ws.onclose = (event) => {
            this.eventTarget.emit(EventConstants.WS_CLOSED, "WebSocket instance closed");
            this._userSession = null;
        };

        this._ws.onmessage = (event) => {
            this.eventTarget.emit(EventConstants.WS_GOT_MESSAGE, event.data);
        };
    }

    writeMessage(chat_id: number, message: string) {
        if (!this.isActive()) {
            console.error("WS manager is not active!");
            return;
        }

        let data = {
            "chat_id": chat_id,
            "message": message
        };

        this._ws.send(JSON.stringify(data));
    }

    dispose() {
        if (!this.isActive()) {
            return;
        }

        this._ws.close(1000, "closed by client");
    }
}