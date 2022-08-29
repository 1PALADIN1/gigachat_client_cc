import { ISessionEntity } from "../entity/ISessionEntity";
import { IUserInfo } from "../entity/IUserInfo";
import { ApiConstants } from "../network/ApiConstants";
import { UserSession } from "../network/auth/UserSession";
import { HttpRequestMaker } from "../network/HttpRequestMaker";
import { EventTarget } from "cc";
import { EventConstants } from "../EventConstants";

export interface IUser extends ISessionEntity {
    eventTarget: EventTarget;

    findUser(searchString: string);
}

export class User implements IUser {
    eventTarget: EventTarget = new EventTarget();

    private _httpRequestMaker: HttpRequestMaker;

    private _userSession: UserSession;

    constructor(httpRequestMaker: HttpRequestMaker) {
        this._httpRequestMaker = httpRequestMaker;
    }

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }

    findUser(searchString: string) {
        let url = ApiConstants.buildRestAddr(this._userSession.baseServerUrl, ApiConstants.FIND_USER_ROUTE) + "/" + searchString;
        let req = this._httpRequestMaker.createNewRequestWithAuth(url, ApiConstants.HTTP_GET, this._userSession, (error, message) => {
            if (error) {
                console.error(message);
                return;
            }

            let resp: IUserInfo[] = JSON.parse(message.toString());
            this.eventTarget.emit(EventConstants.USER_FOUND, resp);
        });

        req.send();
    }
}