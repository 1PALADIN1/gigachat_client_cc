import { UserSession } from "./UserSession";
import { EventTarget } from 'cc';

export enum AuthEventType {
    ERROR = "error",
    SIGN_IN_SUCCESS = "sign_in_success",
    SIGN_UP_SUCCESS = "sign_up_success"
}

export interface IAuth {
    authResultEvent: EventTarget

    signInUser(username: string, password: string)
    signUpUser(username: string, password: string)
}

export class Auth implements IAuth {
    private _requestTimeout = 5_000;
    private _baseUrl: string;

    authResultEvent: EventTarget;

    constructor(baseUrl: string) {
        this._baseUrl = baseUrl;
        this.authResultEvent = new EventTarget();
    }

    signInUser(username: string, password: string) {
        let url = "http://" + this._baseUrl + "/api/auth/sign-in";
        let req = this._createNewRequest(url, "POST", (error, message) => {
            if (error) {
                this.authResultEvent.emit(AuthEventType.ERROR, message);
                return;
            }

            let result = JSON.parse(message);
            let session = new UserSession(result["access_token"]);
            this.authResultEvent.emit(AuthEventType.SIGN_IN_SUCCESS, session);
        })

        let data = {
            "username": username,
            "password": password
        };

        console.log("Trying to sign in with url: " + url + "...");
        req.send(JSON.stringify(data));
    }
    
    signUpUser(username: string, password: string) {
        let url = "http://" + this._baseUrl + "/api/auth/sign-up";
        let req = this._createNewRequest(url, "POST", (error, message) => {
            if (error) {
                this.authResultEvent.emit(AuthEventType.ERROR, message);
                return;
            }

            this.authResultEvent.emit(AuthEventType.SIGN_UP_SUCCESS, message);
        })

        let data = {
            "username": username,
            "password": password
        };

        console.log("Trying to sign up with url: " + url + "...");
        req.send(JSON.stringify(data));
    }

    private _createNewRequest(url: string, method: string, callback: (error: boolean, mesasge: string) => void) {
        let req = new XMLHttpRequest();
        req.open("POST", url, true);

        req.onreadystatechange = () => {
            if (req.readyState != 4) {
                return;
            }

            if (req.status != 200) {
                callback(true, req.responseText);
                return;
            }

            callback(false, req.responseText);
        };

        req.ontimeout = () => {
            callback(true, "timeout");
        };

        req.timeout = this._requestTimeout;
        req.setRequestHeader("Content-Type", "application/json");
        return req;
    }
}