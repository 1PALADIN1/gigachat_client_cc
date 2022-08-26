import { UserSession } from "../../network/auth/UserSession";
import { IUiController } from "./IUiController";

export interface ISessionController extends IUiController{
    bindSession(userSession: UserSession);
}