import { UserSession } from "./auth/UserSession";

const requestTimeout: number = 5_000;

export class HttpRequestMaker {

    createNewRequestWithAuth(url: string, method: string, userSession: UserSession, callback: (error: boolean, message: string) => void) {
        let req = this.createNewRequest(url, method, callback);
        userSession.setAuthHeader(req);
        return req
    }

    createNewRequest(url: string, method: string, callback: (error: boolean, message: string) => void) {
        let req = new XMLHttpRequest();
        req.open(method, url, true);

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

        req.timeout = requestTimeout;
        req.setRequestHeader("Content-Type", "application/json");
        return req;
    }
}