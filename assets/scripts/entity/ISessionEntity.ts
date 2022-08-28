import { UserSession } from "../network/auth/UserSession";

export interface ISessionEntity {
    bindSession(userSession: UserSession);
}