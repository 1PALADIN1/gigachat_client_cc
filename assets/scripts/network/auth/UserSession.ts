export class UserSession {
    private _authorizationHeader = "Authorization";
    private _token: string;

    constructor(token: string) {
        this._token = token;
    }

    get token() {
        return this._token;
    }

    setAuthHeader(req: XMLHttpRequest) {
        req.setRequestHeader(this._authorizationHeader, "Bearer " + this._token)
    }
}