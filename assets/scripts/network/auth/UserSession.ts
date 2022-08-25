export class UserSession {
    private _authorizationHeader = "Authorization";
    private _token: string;
    private _serverBaseUrl: string;

    constructor(token: string, serverBaseUrl: string) {
        this._token = token;
        this._serverBaseUrl = serverBaseUrl;
    }

    get token() : string {
        return this._token;
    }

    get baseServerUrl() : string {
        return this._serverBaseUrl;
    }

    setAuthHeader(req: XMLHttpRequest) {
        req.setRequestHeader(this._authorizationHeader, "Bearer " + this._token)
    }
}