export class UserSession {
    private _authorizationHeader = "Authorization";
    private _token: string;
    private _serverBaseUrl: string;
    private _username: string;
    private _userId: number;

    constructor(token: string, serverBaseUrl: string, username: string, userId: number) {
        this._token = token;
        this._serverBaseUrl = serverBaseUrl;
        this._username = username;
        this._userId = userId;
    }

    get token(): string {
        return this._token;
    }

    get baseServerUrl(): string {
        return this._serverBaseUrl;
    }

    get username(): string {
        return this._username;
    }

    get userId(): number {
        return this._userId;
    }

    setAuthHeader(req: XMLHttpRequest) {
        req.setRequestHeader(this._authorizationHeader, "Bearer " + this._token)
    }
}