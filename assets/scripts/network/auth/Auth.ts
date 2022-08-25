import { EventTarget } from 'cc';
import { ApiConstants } from '../ApiConstants';

export enum AuthEventType {
    ERROR = "error",
    SIGN_IN_SUCCESS = "sign_in_success",
    SIGN_UP_SUCCESS = "sign_up_success"
}

export interface IAuth {
    authResultEvent: EventTarget;

    set baseUrl(value: string);
    get baseUrl() : string;

    signInUser(username: string, password: string);
    signUpUser(username: string, password: string);
}

export class Auth implements IAuth {
    private _requestTimeout = 5_000;
    private _baseUrl: string;

    authResultEvent: EventTarget;

    set baseUrl(value: string) {
        this._baseUrl = value;
    }

    get baseUrl() : string {
        return this._baseUrl;
    }

    constructor() {
        this.authResultEvent = new EventTarget();
    }

    signInUser(username: string, password: string) {
        let url = ApiConstants.buildRestAddr(this._baseUrl, ApiConstants.SIGN_IN_ROUTE);
        let req = this._createNewRequest(url, "POST", (error, message) => {
            if (error) {
                this.authResultEvent.emit(AuthEventType.ERROR, message);
                return;
            }

            let result = JSON.parse(message);
            this.authResultEvent.emit(AuthEventType.SIGN_IN_SUCCESS, result["access_token"]);
        })

        let data = {
            "username": username,
            "password": password
        };

        console.log("Trying to sign in with url: " + url + "...");
        req.send(JSON.stringify(data));
    }
    
    signUpUser(username: string, password: string) {
        let url = ApiConstants.buildRestAddr(this._baseUrl, ApiConstants.SIGN_UP_ROUTE);
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