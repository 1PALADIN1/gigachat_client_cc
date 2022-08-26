import { UserSession } from "../../network/auth/UserSession";
import { ISessionController } from "./ISessionController";

export class ChatController implements ISessionController {
    private _userSession: UserSession;

    bindSession(userSession: UserSession) {
        this._userSession = userSession;
    }
    
    activate() {
    }

    deactivate() {
    }

}